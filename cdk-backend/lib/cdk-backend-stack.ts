import * as cdk from "@aws-cdk/core";
import { CognitoComponent } from "./cdk-cognito-component";
import { StorageComponent } from "./cdk-storage-component";

export class CdkBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.CfnOutput(this, "aws_project_region", {
      value: this.region,
    });

    const cognitoComponent = new CognitoComponent(this, "cognitoComponent", {
      userPoolName: "amplify-storage-cdk-user-pool",
    });

    const storageComponent = new StorageComponent(this, "storageComponent", {
      authenticatedRole: cognitoComponent.authenticatedRole,
      unAuthenticatedRole: cognitoComponent.unAuthenticatedRole,
    });
  }
}
