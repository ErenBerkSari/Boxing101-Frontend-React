import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import MovementDetail from "../components/MovementDetail";
import BoxingProgramDetail from "../components/ProgramDetail";
import StartProgram from "../components/StartProgram";
import ProgramStarter from "../components/ProgramStarter";
import CompleteDay from "../components/CompleteDay";

function RouterConfig() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movements/:movementId" element={<MovementDetail />} />
        <Route path="/program/:programId" element={<BoxingProgramDetail />} />
        {/* <Route path="/program/:programId/starts" element={<StartProgram />} /> */}
        <Route path="/program/:programId/starts" element={<ProgramStarter />} />
        <Route path="/completeDay/:programId" element={<CompleteDay />} />
      </Routes>
    </div>
  );
}

export default RouterConfig;
