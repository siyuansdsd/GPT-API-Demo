import OpenAiService from "../../../service/openAI.service";
import VectorHintService from "../../../service/vectorhint.service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { V2Controller } from "../../v2/v2.controller";
import { BadRequestError } from "../../../common/common";

jest.mock("../../../service/openAI.service");
jest.mock("../../../service/vectorhint.service");

describe("V2Controller", () => {
  let v2Controller: V2Controller;
  let mockOpenAiService: jest.Mocked<OpenAiService>;
  let mockVectorHintService: jest.Mocked<VectorHintService>;

  beforeEach(() => {
    mockOpenAiService = new OpenAiService() as jest.Mocked<OpenAiService>;
    mockVectorHintService =
      new VectorHintService() as jest.Mocked<VectorHintService>;
    v2Controller = new V2Controller();
    (v2Controller as any).openAiService = mockOpenAiService;
    (v2Controller as any).vectorHintService = mockVectorHintService;

    mockVectorHintService.getHint = jest.fn();
    mockOpenAiService.getAnswer = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the answer from OpenAiService", async () => {
    const mockEvent = {
      body: JSON.stringify({ input: "input_name" }),
    } as APIGatewayProxyEvent;

    const mockResults = ["name1", "name2"];
    const mockAnswer = "name1";

    (mockVectorHintService.getHint as jest.Mock).mockResolvedValue(mockResults);
    (mockOpenAiService.getAnswer as jest.Mock).mockResolvedValue(mockAnswer);

    const result = await v2Controller.getNames(mockEvent);

    expect(mockVectorHintService.getHint).toHaveBeenCalledWith("input_name");
    expect(mockOpenAiService.getAnswer).toHaveBeenCalledWith(
      mockResults,
      "input_name"
    );
    expect(result).toBe(mockAnswer);
  });

  it("should throw BadRequestError if event body is missing", async () => {
    const mockEvent = {} as APIGatewayProxyEvent;

    await expect(v2Controller.getNames(mockEvent)).rejects.toThrow(
      BadRequestError
    );
  });

  it("should throw an error if JSON parsing fails", async () => {
    const mockEvent = {
      body: "{invalid_json}",
    } as APIGatewayProxyEvent;

    await expect(v2Controller.getNames(mockEvent)).rejects.toThrow(
      "Internal error..."
    );
  });

  it('should return "No matched name" if no results are found', async () => {
    const mockEvent = {
      body: JSON.stringify({ input: "input_name" }),
    } as APIGatewayProxyEvent;

    (mockVectorHintService.getHint as jest.Mock).mockResolvedValue([]);

    const result = await v2Controller.getNames(mockEvent);

    expect(result).toBe("No matched name");
  });

  it('should return "No matched name" if all results are undefined', async () => {
    const mockEvent = {
      body: JSON.stringify({ input: "input_name" }),
    } as APIGatewayProxyEvent;

    (mockVectorHintService.getHint as jest.Mock).mockResolvedValue([
      undefined,
      undefined,
    ]);

    const result = await v2Controller.getNames(mockEvent);

    expect(result).toBe("No matched name");
  });

  it("should throw an error if VectorHintService or OpenAiService fails", async () => {
    const mockEvent = {
      body: JSON.stringify({ input: "input_name" }),
    } as APIGatewayProxyEvent;

    (mockVectorHintService.getHint as jest.Mock).mockImplementation(() => {
      throw new Error("VectorHintService error");
    });

    await expect(v2Controller.getNames(mockEvent)).rejects.toThrow(
      "Internal error..."
    );

    (mockVectorHintService.getHint as jest.Mock).mockResolvedValue([
      "name1",
      "name2",
    ]);
    (mockOpenAiService.getAnswer as jest.Mock).mockImplementation(() => {
      throw new Error("OpenAiService error");
    });

    await expect(v2Controller.getNames(mockEvent)).rejects.toThrow(
      "Internal error..."
    );
  });
});
