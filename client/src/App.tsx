import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { Landing, Error, Register, ProtectedRoute } from "./pages";
import {
  AllJobs,
  AddJob,
  Profile,
  SharedLayout,
  Stats,
} from "./pages/dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Amplify } from "aws-amplify";

Amplify.configure({
  aws_project_region: "eu-central-1",
  Auth: {
    region: "eu-central-1",
    userPoolId: "eu-central-1_n61wPsgjP",
    userPoolWebClientId: "5oeqejjo8dnu2dvb6qgm2srad",
  },
  API: {
    endpoints: [
      {
        name: "jobs",
        endpoint:
          "https://c1uxl6bkfc.execute-api.eu-central-1.amazonaws.com/prod/api/jobs",
      },
    ],
  },
});

function App() {
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
