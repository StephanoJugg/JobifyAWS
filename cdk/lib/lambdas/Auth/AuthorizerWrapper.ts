import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  UserPool,
  UserPoolClient,
  UserPoolEmail,
} from 'aws-cdk-lib/aws-cognito';
import { IdentityPoolWrapper } from './IdentityPoolWrapper';
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers';
import {
  CognitoUserPoolsAuthorizer,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';

interface IAuthorizerWrapperProps {
  restApi: RestApi;
}

export class AuthorizerWrapper extends Construct {
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;

  public authorizer: CognitoUserPoolsAuthorizer;
  private identityPoolWrapper: IdentityPoolWrapper;

  constructor(scope: Construct, id: string, props: IAuthorizerWrapperProps) {
    super(scope, id);
    this.initalize();
    this.addUserPoolClient();
    this.createAuthorizer(scope, props.restApi);
    this.initializeIdentityPoolWrapper();
  }

  private initalize() {
    this.userPool = new UserPool(this, 'JobifyUserPool', {
      userPoolName: 'JobifyUserPool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireSymbols: false,
        requireUppercase: false,
      },
      userVerification: {
        emailSubject: 'Verify your email for Jobify',
        emailBody:
          'Thanks for signing up to Jobify! Your verification code is {####}',
      },
      email: UserPoolEmail.withCognito('test@fane.com'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
    });
  }

  private addUserPoolClient() {
    this.userPoolClient = this.userPool.addClient('JobifyUserPool-client', {
      userPoolClientName: 'JobifyUserPool-client',
      authFlows: {
        userPassword: true,
        adminUserPassword: true,
        custom: true,
        userSrp: true,
      },
      generateSecret: false,
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  private initializeIdentityPoolWrapper() {
    this.identityPoolWrapper = new IdentityPoolWrapper(
      this,
      this.userPool,
      this.userPoolClient
    );
  }
  private createAuthorizer(scope: Construct, api: any) {
    this.authorizer = new CognitoUserPoolsAuthorizer(
      scope,
      'JobifyUserAuthorizer',
      {
        cognitoUserPools: [this.userPool],
        identitySource: 'method.request.header.Authorization',
        resultsCacheTtl: cdk.Duration.seconds(0),
      }
    );

    this.authorizer._attachToApi(api);
  }

  // private createAdminsGroup() {
  //   new CfnUserPoolGroup(this, 'AdminsGroup', {
  //     groupName: 'Admins',
  //     userPoolId: this.userPool.userPoolId,
  //     //      roleArn: this.identityPoolWrapper.adminRole.roleArn,
  //   });
  // }
}
