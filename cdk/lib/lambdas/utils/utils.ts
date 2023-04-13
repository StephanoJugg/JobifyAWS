import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

export function addCorsHeader(result: APIGatewayProxyResult) {
  result.headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  };
}
