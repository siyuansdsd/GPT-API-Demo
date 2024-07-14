import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  BadRequestError,
  HttpError,
  UnexpectedError,
  Response,
} from "../common/common";
import { V1Controller } from "../controller/v1/v1.controller";
import { V2Controller } from "../controller/v2/v2.controller";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case "PUT":
        if (event.path.includes("api/v1")) {
          const v1Controller = new V1Controller();
          const answer = await v1Controller.getNames(event);
          return Response(200, {
            answer,
          });
        }
        if (event.path.includes("api/v2")) {
          const v2Controller = new V2Controller();
          const answer = await v2Controller.getNames(event);
          return Response(200, {
            answer,
          });
        }
        throw new BadRequestError(`Unsupported path ${event.path}`);
      default: {
        throw new BadRequestError(`Unsupported method "${event.httpMethod}"`);
      }
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return error.response();
    } else {
      return new UnexpectedError(
        "An error occurred while processing your request."
      ).response();
    }
  }
};
