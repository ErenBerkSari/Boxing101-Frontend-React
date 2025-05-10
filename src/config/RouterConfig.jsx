import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import MovementDetail from "../components/MovementDetail";
import BoxingProgramDetail from "../components/ProgramDetail";

function RouterConfig() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movements/:movementId" element={<MovementDetail />} />
        <Route path="/program/:programId" element={<BoxingProgramDetail />} />
      </Routes>
    </div>
  );
}

export default RouterConfig;
