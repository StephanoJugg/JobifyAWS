import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { Landing, Error, Register } from "./pages";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Dashboard</h1>}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="*" element={<Error />}></Route>
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
