import OpenAI from 'openai';
import { Item } from '@/types';

// For this MVP, we will instantiate the client with a key provided by the user in the UI
// or from environment variables if available.
export const organizeItemsWithAI = async (items: Item[], apiKey: string) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Enabling client-side usage for this demo
  });

  const itemsData = items.map(item => ({
    id: item.id,
    content: item.content,
    type: item.type
  }));

  const prompt = `
    You are an intelligent spatial organizer. 
    I have a list of items (notes, images, links) on a 2D canvas.
    Your task is to:
    1. Analyze the content of these items.
    2. Group them into logical semantic clusters.
    3. Assign a title to each cluster.
    4. Calculate 2D coordinates (x, y) for each item so that items in the same cluster are close together, and clusters are spread out.
    
    The canvas coordinate system is roughly -1000 to 1000 for both x and y.
    Spread the clusters out nicely.
    
    Return a JSON object with the following structure:
    {
      "clusters": [
        {
          "title": "Cluster Title",
          "items": [
            { "id": "item_id", "x": 123, "y": 456 }
          ]
        }
      ]
    }

    Here are the items:
    ${JSON.stringify(itemsData)}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful assistant that outputs JSON." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");

  return JSON.parse(content);
};
