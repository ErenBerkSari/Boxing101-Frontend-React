import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import MovementDetail from "../components/MovementDetail";
import BoxingProgramDetail from "../components/ProgramDetail";
import ProgramStarter from "../components/ProgramStarter";
import CompleteDay from "../components/CompleteDay";
import CreateProgram from "../components/CreateProgram";
import CreateMovement from "../components/CreateMovement";

function RouterConfig() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movements/:movementId" element={<MovementDetail />} />
        <Route path="/movements/createMovement" element={<CreateMovement />} />

        <Route path="/program/:programId" element={<BoxingProgramDetail />} />
        <Route path="/program/createProgram" element={<CreateProgram />} />

        <Route path="/program/:programId/starts" element={<ProgramStarter />} />
        <Route path="/completeDay/:programId" element={<CompleteDay />} />
      </Routes>
    </div>
  );
}

export default RouterConfig;
