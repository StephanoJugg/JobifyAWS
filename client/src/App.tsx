import { Landing, Error, Register, ProtectedRoute } from './pages';
import {
  AllJobs,
  AddJob,
  Profile,
  SharedLayout,
  Stats,
} from './pages/dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import * as AWS from 'aws-sdk';

Amplify.configure({
  aws_project_region: 'eu-central-1',
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_kU37rZIY8',
    userPoolWebClientId: '2immfs5p4tuj6v55i0eodr9tdg',
  },
  API: {
    endpoints: [
      {
        name: 'jobs',
        endpoint:
          'https://1kvyclmtse.execute-api.eu-central-1.amazonaws.com/prod/api',
      },
    ],
  },
});

function App() {
  console.log(AWS.config.credentials);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="*" element={<Error />}></Route>
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
