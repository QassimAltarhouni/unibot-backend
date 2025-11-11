import { GoogleGenAI } from '@google/genai';
const GoogleStudioService = async (message: string) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
      responseMimeType: 'text/plain',
    };
    const model = 'gemini-2.5-flash-preview-04-17';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let fullText = '';
    for await (const chunk of response) {
      console.log(chunk.text); // Optional: log each chunk as it arrives
      fullText += chunk.text; // Accumulate text chunks
    }

    return fullText;
  } catch (e) {
    console.log(`PRUNE: ${e}`);
    return 'There was an issue with the Google Studio API.';
  }
};

export default GoogleStudioService;
