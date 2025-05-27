import React from "react";
import Header from "./Header";
import Pioneer from "./Pioneer";
import ChooseProgram from "./ChooseProgram";
import Movements from "./Movements";
import Footer from "./Footer";
import BoxingPrograms from "./BoxingPrograms";

function Home() {
  return (
    <section id="home">
      <Header />
      <Pioneer />
      <ChooseProgram />
      <BoxingPrograms />
      <Movements />
      <Footer />
    </section>
  );
}

export default Home;
