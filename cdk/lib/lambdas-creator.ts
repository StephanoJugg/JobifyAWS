import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");

interface IJobifyStackProps {
  jobTableName: string;
}

export class LambdasCreator extends Construct {
  public getJobsLambda: NodejsFunction;
  public postJobLambda: NodejsFunction;
  private jobTableName: string;

  constructor(scope: Construct, id: string, props: IJobifyStackProps) {
    super(scope, id);
    this.jobTableName = props.jobTableName;

    this.getJobsLambda = this.createLambda(
      id + "-GetJobsLambda",
      path.join(__dirname, "lambdas", "jobs", "get-jobs.ts")
    );
    this.postJobLambda = this.createLambda(
      id + "-PostJobLambda",
      path.join(__dirname, "lambdas", "jobs", "post-job.ts")
    );
  }

  createLambda(name: string, path: string) {
    const lambda = new NodejsFunction(this, name, {
      entry: path,
      handler: "handler",
      functionName: name,
      environment: {
        JOB_TABLE_NAME: this.jobTableName,
      },
    });
    return lambda;
  }
}
