import { OpenAI, ClientOptions } from "openai";

const clientOptions: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY,
};

export default class OpenAiService {
  private openAI: OpenAI;

  constructor() {
    this.openAI = new OpenAI(clientOptions);
  }

  public getAnswer = async (results: string[], input: string) => {
    if (input === "" || results.length === 0) {
      return "No matched name";
    }
    if (results.length === 1) {
      return results[0]; // if there is only one result, return it directly
    }
    console.log("openAI", process.env.OPENAI_API_KEY);
    const names = results.join(", ");
    const prompt = `Which of the following names is mostly like the ${input}(only output the full following matched name and no other words)? \n${names}\n`;
    const model = "gpt-3.5-turbo";
    const response = await this.openAI.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 60,
    });

    if (
      !response ||
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message ||
      !response.choices[0].message.content
    ) {
      throw new Error("Invalid response from OpenAI API");
    }
    const answer = response.choices[0].message.content.trim();
    return answer;
  };
}
