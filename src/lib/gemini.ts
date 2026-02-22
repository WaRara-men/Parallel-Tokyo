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
  if (!apiKey) return getRandomFallbackLegend();

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
    return getRandomFallbackLegend();
  }
};

const getRandomFallbackLegend = () => {
  const legends = [
    "終電後の山手線には、13両目が連結されることがあるらしい。乗客は全員、スマホの画面だけを見つめていて、誰も瞬きをしない。",
    "渋谷のスクランブル交差点、雨の日だけ現れる透明な傘の群れ。あれは、待ち合わせに来なかった誰かを待ち続けている思念体だとか。",
    "深夜のコンビニで、バーコードのない商品をレジに通すと、店員の顔が一瞬だけノイズになる。レシートには「あなたの寿命」が印字されている。",
    "新宿の地下ダンジョンには、Wi-Fiの電波が届かない「真空地帯」がある。そこでSNSを開くと、未来の自分からのDMが届くらしい。",
    "高層ビルの窓拭きゴンドラには、誰も乗っていないのに揺れている時がある。あれは、東京の上空を泳ぐ巨大な透明な魚がぶつかっているんだ。",
    "ある自動販売機で「あたたかい」と「つめたい」を同時に押すと、泥のような味の缶コーヒーが出てくる。飲むと、他人の記憶が流れ込んでくる。",
    "深夜2時のコインランドリーで、誰もいないのに洗濯機が回っていることがある。中を覗くと、自分の顔が洗われているのが見える。",
    "東京タワーの展望台から、特定の角度で街を見下ろすと、ビル群がQRコードの形に見える瞬間がある。読み込むと、スマホが二度と起動しなくなる。"
  ];
  return legends[Math.floor(Math.random() * legends.length)];
};

export const generatePurification = async (worry: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return getRandomFallbackPurification();

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
    return getRandomFallbackPurification();
  }
};

const getRandomFallbackPurification = () => {
  const messages = [
    "その痛みは、夜風に溶けて星になりました。",
    "灰になった言葉は、もう誰をも傷つけません。",
    "炎が揺れるように、心も揺れていいのです。",
    "静寂の中に、あなたの安らぎが戻ってきますように。",
    "燃え尽きた悩みは、新しい朝の光に変わります。",
    "深く息を吸って。煙と共に、重荷を手放しましょう。",
    "大丈夫。夜はすべてを優しく包み込んでくれます。",
    "あなたの涙は、炎の中で温かい光へと昇華されました。"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};
