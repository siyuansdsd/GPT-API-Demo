import OpenAiService from "../../../service/openAI.service";
import NamesService from "../../../service/names.service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { V1Controller } from "../../v1/v1.controller";
import { BadRequestError } from "../../../common/common";

jest.mock("../../../service/openAI.service");
jest.mock("../../../service/names.service");

describe("V1Controller", () => {
  let v1Controller: V1Controller;
  let mockOpenAiService: jest.Mocked<OpenAiService>;
  let mockNamesService: jest.Mocked<NamesService>;

  beforeEach(() => {
    mockOpenAiService = new OpenAiService() as jest.Mocked<OpenAiService>;
    mockNamesService = new NamesService() as jest.Mocked<NamesService>;
    v1Controller = new V1Controller();
    (v1Controller as any).openAiService = mockOpenAiService;
    (v1Controller as any).namesService = mockNamesService;

    mockNamesService.getNames = jest.fn();
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

    (mockNamesService.getNames as jest.Mock).mockReturnValue(mockResults);
    (mockOpenAiService.getAnswer as jest.Mock).mockResolvedValue(mockAnswer);

    const result = await v1Controller.getNames(mockEvent);

    expect(mockNamesService.getNames).toHaveBeenCalledWith("input_name");
    expect(mockOpenAiService.getAnswer).toHaveBeenCalledWith(
      mockResults,
      "input_name"
    );
    expect(result).toBe(mockAnswer);
  });

  it("should throw BadRequestError if event body is missing", async () => {
    const mockEvent = {} as APIGatewayProxyEvent;

    await expect(v1Controller.getNames(mockEvent)).rejects.toThrow(
      BadRequestError
    );
  });

  it("should throw an error if JSON parsing fails", async () => {
    const mockEvent = {
      body: "{invalid_json}",
    } as APIGatewayProxyEvent;

    await expect(v1Controller.getNames(mockEvent)).rejects.toThrow(
      "Internal error..."
    );
  });

  it("should throw an error if NamesService or OpenAiService fails", async () => {
    const mockEvent = {
      body: JSON.stringify({ input: "input_name" }),
    } as APIGatewayProxyEvent;

    (mockNamesService.getNames as jest.Mock).mockImplementation(() => {
      throw new Error("NamesService error");
    });

    await expect(v1Controller.getNames(mockEvent)).rejects.toThrow(
      "Internal error..."
    );

    (mockNamesService.getNames as jest.Mock).mockReturnValue([
      "name1",
      "name2",
    ]);
    (mockOpenAiService.getAnswer as jest.Mock).mockImplementation(() => {
      throw new Error("OpenAiService error");
    });

    await expect(v1Controller.getNames(mockEvent)).rejects.toThrow(
      "Internal error..."
    );
  });
});
