import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors';
import { StatusCodes } from 'http-status-codes';
import { getJobs, createJobs, deleteJobs } from '../db/dynamoDb';
import { APIGateway } from 'aws-sdk';
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { addCorsHeader } from '../utils/utils';
interface IStats {
  pending: number;
  declined: number;
  interview: number;
}

interface IMonthlyApplication {
  date: string;
  count: number;
}

interface IQueryObject {
  createdBy: string;
  status?: string;
  jobType?: string;
  sort?: string;
  position?: object;
}

const createJob = async (
  event: APIGatewayProxyEvent,
  req: Request,
  res: Response
) => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
    }),
  };

  addCorsHeader(result);

  const { status, jobType, sort, position, createdBy } = req.body;
  try {
    await createJobs({ createdBy, status, jobType, sort, position });
    result.body = JSON.stringify({ message: 'success' });
  } catch (error) {
    console.log('error is ', error);
    result.body = JSON.stringify({ message: 'error' });
  }
  return result;
};
const deleteJob = async (
  event: APIGatewayProxyEvent,
  req: Request,
  res: Response
) => {
  res.status(StatusCodes.OK).json({});
};
const getAllJobs = async (
  event: APIGatewayProxyEvent,
  req: Request,
  res: Response
) => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
    }),
  };

  addCorsHeader(result);
  try {
    await getJobs();
    result.body = JSON.stringify({ message: 'success' });
  } catch (error) {
    console.log('error is ', error);
    result.body = JSON.stringify({ message: 'error' });
  }
  return result;
};
const updateJob = async (
  event: APIGatewayProxyEvent,
  req: Request,
  res: Response
) => {
  res.status(StatusCodes.OK).json({});
};
const showStats = async (
  event: APIGatewayProxyEvent,
  req: Request,
  res: Response
) => {
  res.status(StatusCodes.OK).json({});
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
