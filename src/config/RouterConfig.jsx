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
import PrivateRoute from "../components/PrivateRoute";
import AdminRoute from "../components/AdminRoute";

function RouterConfig() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movements/:movementId" element={<MovementDetail />} />
      <Route path="/program/:programId" element={<BoxingProgramDetail />} />

      {/* Private Routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/program/user/:programId"
        element={
          <PrivateRoute>
            <BoxingProgramDetailByUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/program/createProgramByUser"
        element={
          <PrivateRoute>
            <CreateProgramByUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/program/programList"
        element={
          <PrivateRoute>
            <ProgramList />
          </PrivateRoute>
        }
      />
      <Route
        path="/program/:programId/starts"
        element={
          <PrivateRoute>
            <ProgramStarter />
          </PrivateRoute>
        }
      />
      <Route
        path="/program/user/:programId/starts"
        element={
          <PrivateRoute>
            <ProgramStarterByUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/completeDay/:programId"
        element={
          <PrivateRoute>
            <CompleteDay />
          </PrivateRoute>
        }
      />
      <Route
        path="/usersPrograms"
        element={
          <PrivateRoute>
            <UsersPrograms />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/adminProfile"
        element={
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        }
      />
      <Route
        path="/movements/createMovement"
        element={
          <AdminRoute>
            <CreateMovement />
          </AdminRoute>
        }
      />
      <Route
        path="/program/createProgramByAdmin"
        element={
          <AdminRoute>
            <CreateProgram />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default RouterConfig;