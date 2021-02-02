# amplify-storage-cdk

This is a sample project using the amplify storage module (frontend), while the backend is created with cdk. So if you like the amplify lib but want to create your infrastructure with cdk, this is the way to go.

Please check out Nadar Dabits [Repo](https://github.com/dabit3/amplify-with-cdk) for how to use Amplfy API (GraphQL) with cdk.

##

## Steps to build the project yourself

```bash
mkdir cdk-backend
cd cdk-backend/
cdk init app --language=typescript
npm install @aws-cdk/aws-cognito @aws-cdk/aws-s3 @aws-cdk/aws-iam
cd ..
npx create-react-app amplify-storage-react-frontend --template typescript
cd amplify-storage-react-frontend
npm install aws-amplify @aws-amplify/ui-react @aws-amplify/ui-components
```

Add environment variables, i.e. as vscode **.vscode/settings.json**:

```json
{
  "editor.formatOnSave": true,
  "[javascript,typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true,
    "source.fixAll": true
  },
  "terminal.integrated.env.linux": {
    "AWS_ACCOUNT_ID": "XXXXXXXX",
    "AWS_REGION": "XXXXXXXX",
    "AWS_PROFILE": "XXXXXXXX"
  }
}
```

You need to update the following files from this repo:

- cdk-backend
  - bin/cdk-backend.ts
  - lib/cdk-backend-stack.ts
  - lib/cdk-storage-component.ts
  - lib/cdk-cognito-component.ts
  - package.json
- amplify-storage-react-frontend
  - App.tsx
  - awsconfig.ts

## Build and deploy

Deploy the backend:

```bash
cd cdk-backend/
npm run deploy
```

Start the frontend:

```bash
cd amplify-storage-react-frontend/
npm run start
```

## Hints:

Feel free to delete any unwanted policies from **cdk-backend/lib/cdk-storage-component.ts**
