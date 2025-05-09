import React from "react";
import Header from "./Header";
import Pioneer from "./Pioneer";
import ChooseProgram from "./ChooseProgram";
import Movements from "./Movements";
import Footer from "./Footer";
import CreateMovement from "./CreateMovement";
import BoxingPrograms from "./BoxingPrograms";
import CreateProgram from "./CreateProgram";

function Home() {
  return (
    <div>
      <Header />
      {/* <Pioneer />
      <ChooseProgram /> */}
      <BoxingPrograms />
      <CreateProgram />
      {/* <Movements /> */}
      {/* <Footer /> */}
      {/* <CreateMovement /> */}
    </div>
  );
}

export default Home;
