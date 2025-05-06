import React from "react";
import Header from "./Header";
import Pioneer from "./Pioneer";
import ChooseProgram from "./ChooseProgram";
import Movements from "./Movements";
import Footer from "./Footer";
import CreateMovement from "./CreateMovement";

function Home() {
  return (
    <div>
      <Header />
      {/* <Pioneer />
      <ChooseProgram /> */}
      <Movements />
      {/* <Footer /> */}
      <CreateMovement />
    </div>
  );
}

export default Home;
