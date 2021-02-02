import Amplify from "aws-amplify";
import { CdkBackendStack } from "./cdk-exports.json";

const awsconfig = {
  aws_project_region: CdkBackendStack.awsprojectregion,
  Storage: {
    AWSS3: {
      bucket: CdkBackendStack.storageComponentawsstoragebucketnameE199F756,
      region: CdkBackendStack.awsprojectregion,
    },
  },
  Auth: {
    identityPoolId: CdkBackendStack.cognitoComponentawsidentitypoolidAE1ED89F,
    region: CdkBackendStack.awsprojectregion,
    userPoolId: CdkBackendStack.cognitoComponentawsuserpoolsid1AA115D6,
    userPoolWebClientId:
      CdkBackendStack.cognitoComponentawsuserpoolswebclientidD4E9C42B,
    mandatorySignIn: true,
  },
};

Amplify.configure(awsconfig);
