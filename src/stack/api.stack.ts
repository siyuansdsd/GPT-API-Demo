import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as Apigateway from "aws-cdk-lib/aws-apigateway";
import * as Cdk from "aws-cdk-lib";
import { dirname, join } from "path";
import * as dotenv from "dotenv";

dotenv.config();
export function createApiStack(Stack: Cdk.Stack) {
  const Lambda = new NodejsFunction(Stack, "NamesLambda", {
    entry: join(dirname(__dirname), "../.build/lambdas/index/index.js"),
    handler: "index.handler",
    timeout: Cdk.Duration.seconds(45),
    environment: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
      PINECONE_API_KEY: process.env.PINECONE_API_KEY || "",
    },
  });

  const api = new Apigateway.RestApi(Stack, "NamesApi", {
    restApiName: "Names Service",
    description: "This service for searching Names.",
  });

  const root = api.root.addResource("api");
  const v1 = root.addResource("v1");
  const v2 = root.addResource("v2");

  const v1Methods = ["PUT", "OPTIONS"];
  const v2Methods = ["PUT", "OPTIONS"];

  v1Methods.forEach((method) => {
    v1.addMethod(method, new Apigateway.LambdaIntegration(Lambda));
  });

  v2Methods.forEach((method) => {
    v2.addMethod(method, new Apigateway.LambdaIntegration(Lambda));
  });

  new Cdk.CfnOutput(Stack, "Marks API URL", {
    value: api.url,
    description: "Names API URL",
  });

  return api;
}
