import express from 'express';
import * as awsServerlessExpress from 'aws-serverless-express';
import jobRoutes from './routes/jobRoutes';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

//app.use(authentication('eu-central-1', 'eu-central-1_n61wPsgjP'));

app.get('/api', (req, res) => {
  console.log('request is ', req);
  // print body
  console.log('body is ', req.body);
  // print auth header
  console.log('auth header is ', req.headers.authorization);

  res.send('Hello from API!');
});

app.use('/api/jobs', jobRoutes);

// Handle other routes as needed

const server = awsServerlessExpress.createServer(app);

export const handler = (event: any, context: any, callback: any) => {
  console.log('event is ', event);
  awsServerlessExpress.proxy(server, event, {
    ...context,
    succeed: (response: any) => {
      // Add the necessary CORS headers to the response
      response.headers = {
        ...response.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
        'Access-Control-Allow-Headers': '*',
      };
      callback(null, response);
    },
  });
};
