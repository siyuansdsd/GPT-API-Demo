import OpenAiService from "../../service/openAI.service";
import VectorHintService from "../../service/vectorhint.service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RequestBody } from "../../../shared/interface/requestBody";
import { BadRequestError } from "../../common/common";

export class V2Controller {
  private openAiService: OpenAiService;
  private vectorHintService: VectorHintService;

  constructor() {
    this.openAiService = new OpenAiService();
    this.vectorHintService = new VectorHintService();
  }

  public getNames = async (event: APIGatewayProxyEvent) => {
    let body: RequestBody;
    if (!event.body) {
      throw new BadRequestError("Lack of input body");
    }
    try {
      body = JSON.parse(event.body);
      const results = await this.vectorHintService.getHint(body.input);
      if (results.length === 0) {
        return "No matched name";
      }
      if (results[0] === undefined && results[1] === undefined) {
        return "No matched name";
      }
      const filteredResults = results.filter(
        (result) => result !== undefined
      ) as string[];
      const answer = await this.openAiService.getAnswer(
        filteredResults,
        body.input
      );
      return answer;
    } catch (error) {
      throw new Error("Internal error...");
    }
  };
}
