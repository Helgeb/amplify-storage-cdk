import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";

export interface CognitoProps {
  userPoolName: string;
}

export class CognitoComponent extends cdk.Construct {
  readonly userPool: cognito.UserPool;
  readonly authenticatedRole: iam.Role;
  readonly unAuthenticatedRole: iam.Role;

  constructor(scope: cdk.Construct, id: string, props: CognitoProps) {
    super(scope, id);

    const { userPoolName } = props;

    this.userPool = new cognito.UserPool(this, "userPool", {
      userPoolName,
      signInAliases: {
        username: true,
      },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false,
      },
    });

    new cdk.CfnOutput(this, "aws_user_pools_id", {
      value: this.userPool.userPoolId,
    });

    const client = new cognito.UserPoolClient(this, "userPoolClient", {
      userPool: this.userPool,
      generateSecret: false,
    });

    new cdk.CfnOutput(this, "aws_user_pools_web_client_id", {
      value: client.userPoolClientId,
    });

    const identityPool = new cognito.CfnIdentityPool(this, "identityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: client.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    new cdk.CfnOutput(this, "aws_identity_pool_id", {
      value: identityPool.ref,
    });

    const federatedPrincipal = (stringLike: String) =>
      new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": stringLike,
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      );

    this.authenticatedRole = new iam.Role(
      this,
      "CognitoDefaultAuthenticatedRole",
      {
        assumedBy: federatedPrincipal("authenticated"),
      }
    );

    this.unAuthenticatedRole = new iam.Role(
      this,
      "CognitoDefaultUnauthenticatedRole",
      {
        assumedBy: federatedPrincipal("unauthenticated"),
      }
    );

    new cognito.CfnIdentityPoolRoleAttachment(this, "DefaultValid", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
    });
  }
}
