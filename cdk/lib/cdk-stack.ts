import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
const { Runtime } = require('aws-cdk-lib/aws-lambda');
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  AuthorizationType,
  LambdaIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { AuthorizerWrapper } from './lambdas/Auth/AuthorizerWrapper';

interface IJobifyStackProps extends cdk.StackProps {
  name: string;
}

export class JobifyStack extends cdk.Stack {
  private restApi: RestApi;
  private authorizer: AuthorizerWrapper;

  constructor(scope: Construct, id: string, props: IJobifyStackProps) {
    super(scope, id, props);

    this.restApi = new RestApi(this, 'JobifyApi', {
      restApiName: 'JobifyAPI',
    });

    this.authorizer = new AuthorizerWrapper(this, props.name, {
      restApi: this.restApi,
    });

    const table = new Table(this, 'Jobify', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: id + '-jobsTable',
    });

    const expressServerLambda = new NodejsFunction(
      this,
      'ExpressServerLambda',
      {
        entry: path.join(__dirname, 'lambdas', 'express-server.ts'),
        runtime: Runtime.NODEJS_16_X,
        handler: 'handler',
        functionName: id + 'ExpressServerLambda',
        timeout: cdk.Duration.seconds(30),
        initialPolicy: [
          new PolicyStatement({
            actions: ['dynamodb:*', 'logs:*'],
            resources: [table.tableArn],
            effect: Effect.ALLOW,
          }),
        ],
        environment: {
          JOBS_TABLE: table.tableName,
        },
      }
    );

    const expressRoute = this.restApi.root.addProxy({
      defaultIntegration: new LambdaIntegration(expressServerLambda),
      defaultMethodOptions: {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
          authorizerId: this.authorizer.authorizer.authorizerId,
        },
      },
    });

    this.restApi.addGatewayResponse('default4XX', {
      type: cdk.aws_apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Methods': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
      },
    });

    this.restApi.addGatewayResponse('default5XX', {
      type: cdk.aws_apigateway.ResponseType.DEFAULT_5XX,
      responseHeaders: {
        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Methods': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
      },
    });

    expressRoute.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['*'],
      allowHeaders: ['*'],
    });

    new CfnOutput(this, 'APIEndpoint', {
      value: this.restApi.url!,
      description: 'The endpoint of the API Gateway',
    });
  }
}
