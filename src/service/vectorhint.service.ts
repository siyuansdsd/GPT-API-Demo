import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI, ClientOptions } from "openai";

export default class VectorHintService {
  private pinecone: Pinecone;
  private indexName: string;
  private openAI: OpenAI;
  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "your-api-key",
    });
    this.indexName = process.env.PINECONE_INDEX_NAME || "name-vector";
    const clientOptions: ClientOptions = {
      apiKey: process.env.OPENAI_API_KEY,
    };
    this.openAI = new OpenAI(clientOptions);
  }

  private embedding = async (data: string[]) => {
    const model = "text-embedding-3-small";
    const embedding = await this.openAI.embeddings.create({
      model,
      input: data,
    });
    const embeddingList = embedding.data.map((item) => item.embedding);
    return embeddingList;
  };

  private getIndex = async (indexName: string) => {
    return this.pinecone.Index(indexName);
  };

  public getHint = async (input: string) => {
    const index = await this.getIndex(this.indexName);
    const embeddingList = await this.embedding([input]);
    const query = {
      vector: embeddingList[0],
      topK: 2,
      includeMetadata: true,
    };
    const result = await index.query(query);
    const rf1 = result.matches[0]?.metadata?.["text"].toString();
    const rf2 = result.matches[1]?.metadata?.["text"].toString();
    const answers = [rf1, rf2];
    return answers;
  };
}
