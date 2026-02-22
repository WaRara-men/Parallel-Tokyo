import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  const key = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!key) {
    console.error("VITE_GOOGLE_API_KEY is not set");
    return "";
  }
  return key;
};

export const generateUrbanLegend = async (): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "APIキーが設定されていません。";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      あなたは東京の裏側に潜む「デジタルの怪異」です。
      現代の東京で噂されている、不気味で少し悲しい、しかしどこか美しい都市伝説を1つ語ってください。
      
      条件:
      - 200文字以内
      - ターゲット: 20代〜30代の孤独な現代人
      - トーン: シニカル、ミステリアス、少しのグリッチ感
      - 内容: 終電、スマホ、コンビニ、SNS、高層ビルなどの現代的な要素を含めること
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating urban legend:", error);
    return "ノイズが激しい... 接続できませんでした...";
  }
};

export const generatePurification = async (worry: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "炎が静かに揺れている...";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      あなたは焚き火の炎です。人々の悩みや悲しみを燃やし、空へと昇華させる存在です。
      ユーザーが以下の悩みを燃やしました。
      
      悩み: "${worry}"
      
      この悩みを受け止め、優しく、短く、心に寄り添うような「浄化の言葉」をかけてください。
      
      条件:
      - 100文字以内
      - トーン: 温かい、静寂、哲学的、受容
      - 決してアドバイスや説教をしないこと。ただ共感し、消えゆく煙のように美しく表現すること。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating purification:", error);
    return "悩みは煙となり、夜空へ消えていきました。";
  }
};
