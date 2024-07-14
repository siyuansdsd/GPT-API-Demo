import OpenAiService from "../../service/openAI.service";
import NamesService from "../../service/names.service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RequestBody } from "../../../shared/interface/requestBody";
import { BadRequestError } from "../../common/common";

export class V1Controller {
  private openAiService: OpenAiService;
  private namesService: NamesService;

  constructor() {
    this.openAiService = new OpenAiService();
    this.namesService = new NamesService();
  }

  public getNames = async (event: APIGatewayProxyEvent) => {
    let body: RequestBody;
    if (!event.body) {
      throw new BadRequestError("Lack of input body");
    }
    try {
      body = JSON.parse(event.body);
      const results = this.namesService.getNames(body.input);
      const answer = await this.openAiService.getAnswer(results, body.input);
      return answer;
    } catch (error) {
      throw new Error("Internal error...");
    }
  };
}
