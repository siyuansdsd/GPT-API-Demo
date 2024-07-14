import { v4 as uuid } from "uuid";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI, ClientOptions } from "openai";
import dotenv from "dotenv";

interface PineconeRecord<T> {
  id: string;
  values: number[];
  metadata: T;
}

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "your-api-key",
});

const clientOptions: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openAI = new OpenAI(clientOptions);

const data = [
  "David Smith 大卫 斯密斯",
  "Yueling Zhang 月林张",
  "Huawen Wu 华文吴",
  "Annie Lee 李安妮",
];

function zip<T, U, V>(a: T[], b: U[], c: V[]): [T, U, V][] {
  return a.map((k, i) => [k, b[i], c[i]]); // customized a function work as zip in python
}

const createIndex = async (indexName: string) => {
  const indexList = await pc.listIndexes();
  if (
    indexList &&
    indexList.indexes &&
    indexList.indexes.map((index) => index.name).includes(indexName)
  ) {
    console.log(`Index ${indexName} already exists.`);
    return;
  } else {
    await pc.createIndex({
      name: indexName,
      dimension: 1536, //matches the dimensions of the GPT model
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    console.log(`Index ${indexName} created.`);
    return;
  }
};

const getIndex = async (indexName: string) => {
  return pc.Index(indexName);
};

const embedding = async (data: string[]) => {
  const model = "text-embedding-3-small";
  const embedding = await openAI.embeddings.create({
    model,
    input: data,
  });
  const embeddingList = embedding.data.map((item) => item.embedding);
  return embeddingList;
};

const insertData = async (indexName: string, data: string[]) => {
  const index = await getIndex(indexName);
  const embeddingList = await embedding(data);
  const ids = data.map(() => uuid());
  const metaDataList = data.map((line) => ({ text: line }));
  const zippedData = zip(ids, embeddingList, metaDataList).map(
    ([id, values, metadata]) =>
      ({
        id,
        values,
        metadata,
      } as PineconeRecord<{ text: string }>)
  );
  await index.upsert(zippedData);
};

const main = async () => {
  const indexName = process.env.PINECONE_INDEX_NAME || "name-vector";
  await createIndex(indexName);
  await insertData(indexName, data);
  console.log("Data inserted.");
};

main();
