#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import "source-map-support/register";
import { CdkBackendStack } from "../lib/cdk-backend-stack";

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID!;
const AWS_REGION = process.env.AWS_REGION!;
const env = { region: AWS_REGION, account: AWS_ACCOUNT_ID };

const app = new cdk.App();
new CdkBackendStack(app, "CdkBackendStack", { env });
