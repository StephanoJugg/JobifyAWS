import { LambdasCreator } from "./lambdas-creator";
import * as cdk from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  UserPool,
  UserPoolEmail,
  UserPoolOperation,
} from "aws-cdk-lib/aws-cognito";

interface IJobifyStackProps extends cdk.StackProps {
  name: string;
}

export class JobifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IJobifyStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "JobifyApi", {
      restApiName: "JobifyApi",
    });

    const table = new Table(this, "JobifyTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      tableName: id + "jobsTable",
    });

    const expressServerLambda = new NodejsFunction(
      this,
      "ExpressServerLambda",
      {
        entry: path.join(__dirname, "lambdas", "express-server.ts"),
        handler: "handler",
        functionName: id + "ExpressServerLambda",
        timeout: cdk.Duration.seconds(30),
      }
    );

    const expressRoute = api.root.addProxy({
      defaultIntegration: new LambdaIntegration(expressServerLambda),
    });

    expressRoute.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["*"],
      allowHeaders: ["*"],
    });

    // user verification with link confirmation
    const userPool = new UserPool(this, id + "UserPool", {
      userPoolName: id + "UserPool",
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      signInAliases: { email: true },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireSymbols: false,
        requireUppercase: false,
      },
      userVerification: {
        emailSubject: "Verify your email for Jobify",
        emailBody:
          "Thanks for signing up to Jobify! Your verification code is {####}",
      },
      email: UserPoolEmail.withCognito("test@fane.com"),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = userPool.addClient("JobifyClient", {
      userPoolClientName: id + "JobifyClient",
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
