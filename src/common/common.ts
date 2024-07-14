import { logger } from "../../shared/Utils/logger";
import { APIGatewayEventRequestContext } from "aws-lambda";

const corsHeaders = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

export function BadRequest(
  code: number,
  message: string,
  internalLogMessage: any
) {
  logger.info(`${message} - ${JSON.stringify(internalLogMessage)}`);
  return Response(code);
}

export class HttpError extends Error {
  response = () =>
    BadRequest(this.status_code, this.status_message, this.message);
  protected constructor(
    public readonly status_code: number,
    public readonly status_message: string,
    message?: string | undefined
  ) {
    super(message);
  }
}

export class UnexpectedError extends HttpError {
  constructor(message?: string | undefined) {
    super(500, "UNEXPECTED ERROR", message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message?: string | undefined) {
    super(400, "BAD REQUEST", message);
  }
}

export class NotImplementedError extends HttpError {
  constructor(message?: string | undefined) {
    super(501, "NOT IMPLEMENTED", message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string | undefined) {
    super(403, "FORBIDDEN", message);
  }
}

export function Response(
  code: number,
  body?: object,
  extraHeaders?: { [key: string]: string }
) {
  return {
    statusCode: code,
    body: body ? JSON.stringify(body) : "{}",
    isBase64Encoded: false,
    headers: {
      ...extraHeaders,
      ...corsHeaders,
      "content-type": "application/json",
    },
  };
}

export interface LambdaEvent {
  resource: string;
  path: string;
  httpMethod: string;
  headers?: any;
  queryStringParameters?: any;
  multiValueQueryStringParameters?: any;
  pathParameters?: any;
  stageVariables?: any;
  body?: any;
  isBase64Encoded: boolean;
  test?: {
    tableName: string;
  };
}

export interface APIGatewayProxyEvent {
  body: string | null;
  headers: { [name: string]: string };
  multiValueHeaders: { [name: string]: string[] };
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: { [name: string]: string } | null;
  queryStringParameters: { [name: string]: string } | null;
  multiValueQueryStringParameters: { [name: string]: string[] } | null;
  stageVariables: { [name: string]: string } | null;
  requestContext: APIGatewayEventRequestContext;
  resource: string;
}
