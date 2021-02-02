import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";

export interface StorageProps {
  authenticatedRole: iam.Role;
  unAuthenticatedRole: iam.Role;
  allowedMethods?: s3.HttpMethods[];
}

export class StorageComponent extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: StorageProps) {
    super(scope, id);

    let { authenticatedRole, unAuthenticatedRole, allowedMethods } = props;

    if (!allowedMethods) {
      allowedMethods = [
        s3.HttpMethods.PUT,
        s3.HttpMethods.GET,
        s3.HttpMethods.DELETE,
        s3.HttpMethods.HEAD,
        s3.HttpMethods.POST,
      ];
    }

    const storageBucket = new s3.Bucket(this, "storageBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedMethods,
          maxAge: 3000,
          allowedHeaders: ["*"],
          allowedOrigins: ["*"],
          exposedHeaders: [
            "x-amz-id-2",
            "ETag",
            "x-amz-request-id",
            "x-amz-server-side-encryption",
          ],
        },
      ],
    });

    new cdk.CfnOutput(this, "aws_storage_bucketname", {
      value: storageBucket.bucketName,
    });

    const authenticatedMainPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      resources: [
        `arn:aws:s3:::${storageBucket.bucketName}/public/*`,
        `arn:aws:s3:::${storageBucket.bucketName}/protected/\${cognito-identity.amazonaws.com:sub}/*`,
        `arn:aws:s3:::${storageBucket.bucketName}/private/\${cognito-identity.amazonaws.com:sub}/*`,
      ],
    });

    const authenticatedUploadPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:PutObject"],
      resources: [`arn:aws:s3:::${storageBucket.bucketName}/uploads/*`],
    });

    const authenticatedGetProtectedPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [`arn:aws:s3:::${storageBucket.bucketName}/protected/*`],
    });

    const authenticatedListPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [`arn:aws:s3:::${storageBucket.bucketName}`],
      conditions: {
        StringLike: {
          "s3:prefix": [
            "public/",
            "public/*",
            "protected/",
            "protected/*",
            "private/${cognito-identity.amazonaws.com:sub}/",
            "private/${cognito-identity.amazonaws.com:sub}/*",
          ],
        },
      },
    });

    new iam.Policy(this, "AuthenticatedPrivatePolicy", {
      statements: [
        authenticatedMainPolicyStatement,
        authenticatedListPolicyStatement,
        authenticatedUploadPolicyStatement,
        authenticatedGetProtectedPolicyStatement,
      ],
      roles: [authenticatedRole],
    });

    const unAuthenticatedMainPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      resources: [`arn:aws:s3:::${storageBucket.bucketName}/public/*`],
    });

    const unAuthenticatedUploadPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:PutObject"],
      resources: [`arn:aws:s3:::${storageBucket.bucketName}/uploads/*`],
    });

    const unAuthenticatedGetProtectedPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [`arn:aws:s3:::${storageBucket.bucketName}/protected/*`],
    });

    const unAuthenticatedListPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [`arn:aws:s3:::${storageBucket.bucketName}`],
      conditions: {
        StringLike: {
          "s3:prefix": ["public/", "public/*", "protected/", "protected/*"],
        },
      },
    });

    new iam.Policy(this, "UnAuthenticatedPrivatePolicy", {
      statements: [
        unAuthenticatedMainPolicyStatement,
        unAuthenticatedUploadPolicyStatement,
        unAuthenticatedGetProtectedPolicyStatement,
        unAuthenticatedListPolicyStatement,
      ],
      roles: [unAuthenticatedRole],
    });
  }
}
