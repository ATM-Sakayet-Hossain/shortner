import React from "react";
import Error from "./pages/Error";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
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
