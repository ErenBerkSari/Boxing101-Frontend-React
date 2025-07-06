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
import ChooseProgram from "../components/ChooseProgram";
import BoxingPrograms from "../components/BoxingPrograms";
import Movements from "../components/Movements";
import ProgramList from "../components/ProgramList";
import CreateProgramByUser from "../components/CreateProgramByUser";
import UsersPrograms from "../components/UsersPrograms";
import BoxingProgramDetailByUser from "../components/BoxingProgramDetailByUser";
import ProgramStarterByUser from "../components/ProgramStarterByUser";
import Profile from "../components/Profile";
import AdminProfile from "../components/AdminProfile";

function RouterConfig() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adminProfile" element={<AdminProfile />} />

        <Route path="/movements/:movementId" element={<MovementDetail />} />
        <Route path="/movements/createMovement" element={<CreateMovement />} />
        <Route path="/program/:programId" element={<BoxingProgramDetail />} />
        <Route
          path="/program/user/:programId"
          element={<BoxingProgramDetailByUser />}
        />
        <Route
          path="/program/createProgramByAdmin"
          element={<CreateProgram />}
        />
        <Route
          path="/program/createProgramByUser"
          element={<CreateProgramByUser />}
        />
        <Route path="/program/programList" element={<ProgramList />} />
        <Route path="/program/:programId/starts" element={<ProgramStarter />} />
        <Route
          path="/program/user/:programId/starts"
          element={<ProgramStarterByUser />}
        />
        <Route path="/completeDay/:programId" element={<CompleteDay />} />
        <Route path="/usersPrograms" element={<UsersPrograms />} />
      </Routes>
    </div>
  );
}

export default RouterConfig;
