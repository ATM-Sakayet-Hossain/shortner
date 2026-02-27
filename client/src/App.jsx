import React from "react";
import Error from "./pages/Error";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/layout";
const App = () => {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Error />} />
          </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
