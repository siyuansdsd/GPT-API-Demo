import * as Cdk from "aws-cdk-lib";
import { MainStack } from "../src/stack/main.stack";
import * as dotenv from "dotenv";

dotenv.config();
const app = new Cdk.App();
new MainStack(app, "MainStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stackName: "MainStack",
});
app.synth();
