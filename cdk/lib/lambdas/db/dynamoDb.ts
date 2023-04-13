import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-central-1',
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Jobify-jobsTable';

const getJobs = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    'Access-Control-Allow-Headers': '*',
  };
  try {
    const jobs = await dynamoClient.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(jobs),
      headers: headers,
    };
  } catch (error) {
    console.log('error is ', error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: headers,
    };
  }
};

const createJobs = async (job: any) => {
  const params = {
    TableName: TABLE_NAME,
    Item: job,
  };

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    'Access-Control-Allow-Headers': '*',
  };

  try {
    const jobs = await dynamoClient.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(jobs),
      headers: headers,
    };
  } catch (error) {
    console.log('error is ', error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: headers,
    };
  }
};

const deleteJobs = async (jobId: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: jobId,
    },
  };

  const jobs = await dynamoClient.delete(params).promise();

  return jobs;
};

export { dynamoClient, getJobs, createJobs, deleteJobs };
