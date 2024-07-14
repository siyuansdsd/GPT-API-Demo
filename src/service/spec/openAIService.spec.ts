import OpenAiService from "../openAI.service";
import { OpenAI } from "openai";

jest.mock("openai");

describe("OpenAiService", () => {
  let openAiService: OpenAiService;
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    mockOpenAI = new OpenAI({ apiKey: "test-key" }) as jest.Mocked<OpenAI>;
    openAiService = new OpenAiService();
    (openAiService as any).openAI = mockOpenAI;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return "No matched name" if input is empty', async () => {
    const result = await openAiService.getAnswer(["name1", "name2"], "");
    expect(result).toBe("No matched name");
  });

  it("should return the only result if results length is 1", async () => {
    const result = await openAiService.getAnswer(["name1"], "input");
    expect(result).toBe("name1");
  });

  it("should call OpenAI API and return the answer", async () => {
    const mockCompletionCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: "name2",
          },
        },
      ],
    });

    mockOpenAI.chat = {
      completions: {
        create: mockCompletionCreate,
      },
    } as any;

    const result = await openAiService.getAnswer(["name1", "name2"], "input");

    expect(mockCompletionCreate).toHaveBeenCalled();
    expect(result).toBe("name2");
  });

  it("should throw an error if OpenAI API response is invalid", async () => {
    const mockCompletionCreate = jest.fn().mockResolvedValue({
      choices: [],
    });

    mockOpenAI.chat = {
      completions: {
        create: mockCompletionCreate,
      },
    } as any;

    await expect(
      openAiService.getAnswer(["name1", "name2"], "input")
    ).rejects.toThrow("Invalid response from OpenAI API");
  });
});
