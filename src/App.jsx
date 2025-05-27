import { useEffect, useState } from "react";
import "./App.css";
import RouterConfig from "./config/RouterConfig";
import { loadUser } from "./redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <>
      <RouterConfig />
    </>
  );
}

export default App;
