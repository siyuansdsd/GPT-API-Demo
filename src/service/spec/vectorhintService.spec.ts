import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI, ClientOptions } from "openai";
import VectorHintService from "../vectorhint.service";

jest.mock("@pinecone-database/pinecone");
jest.mock("openai");

describe("VectorHintService", () => {
  let vectorHintService: VectorHintService;
  let mockPinecone: jest.Mocked<Pinecone>;
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    mockPinecone = new Pinecone({
      apiKey: "test-key",
    }) as jest.Mocked<Pinecone>;
    mockOpenAI = new OpenAI({ apiKey: "test-key" }) as jest.Mocked<OpenAI>;

    vectorHintService = new VectorHintService();
    (vectorHintService as any).pinecone = mockPinecone;
    (vectorHintService as any).openAI = mockOpenAI;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return hints based on the input", async () => {
    const mockEmbeddingCreate = jest.fn().mockResolvedValue({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    });

    const mockQuery = jest.fn().mockResolvedValue({
      matches: [
        { metadata: { text: "answer1" } },
        { metadata: { text: "answer2" } },
      ],
    });

    mockOpenAI.embeddings = {
      create: mockEmbeddingCreate,
    } as any;

    mockPinecone.Index = jest.fn().mockReturnValue({
      query: mockQuery,
    } as any);

    const result = await vectorHintService.getHint("input");

    expect(mockEmbeddingCreate).toHaveBeenCalledWith({
      model: "text-embedding-3-small",
      input: ["input"],
    });

    expect(mockQuery).toHaveBeenCalledWith({
      vector: [0.1, 0.2, 0.3],
      topK: 2,
      includeMetadata: true,
    });

    expect(result).toEqual(["answer1", "answer2"]);
  });

  it("should handle case when no matches are found", async () => {
    const mockEmbeddingCreate = jest.fn().mockResolvedValue({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    });

    const mockQuery = jest.fn().mockResolvedValue({
      matches: [],
    });

    mockOpenAI.embeddings = {
      create: mockEmbeddingCreate,
    } as any;

    mockPinecone.Index = jest.fn().mockReturnValue({
      query: mockQuery,
    } as any);

    const result = await vectorHintService.getHint("input");

    expect(mockEmbeddingCreate).toHaveBeenCalledWith({
      model: "text-embedding-3-small",
      input: ["input"],
    });

    expect(mockQuery).toHaveBeenCalledWith({
      vector: [0.1, 0.2, 0.3],
      topK: 2,
      includeMetadata: true,
    });

    expect(result).toEqual([undefined, undefined]);
  });

  it("should handle case when only one match is found", async () => {
    const mockEmbeddingCreate = jest.fn().mockResolvedValue({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    });

    const mockQuery = jest.fn().mockResolvedValue({
      matches: [{ metadata: { text: "answer1" } }],
    });

    mockOpenAI.embeddings = {
      create: mockEmbeddingCreate,
    } as any;

    mockPinecone.Index = jest.fn().mockReturnValue({
      query: mockQuery,
    } as any);

    const result = await vectorHintService.getHint("input");

    expect(mockEmbeddingCreate).toHaveBeenCalledWith({
      model: "text-embedding-3-small",
      input: ["input"],
    });

    expect(mockQuery).toHaveBeenCalledWith({
      vector: [0.1, 0.2, 0.3],
      topK: 2,
      includeMetadata: true,
    });

    expect(result).toEqual(["answer1", undefined]);
  });
});
