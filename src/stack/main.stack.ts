import * as Cdk from "aws-cdk-lib";
import { createApiStack } from "./api.stack";

export class MainStack extends Cdk.Stack {
  constructor(scope: Cdk.App, id: string, props?: Cdk.StackProps) {
    super(scope, id, props);

    createApiStack(this);
  }
}

export default MainStack;
