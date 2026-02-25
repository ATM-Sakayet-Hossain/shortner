import React from "react";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Registration from "./pages/Registration";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Error />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
