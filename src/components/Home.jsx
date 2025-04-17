import React from "react";
import Header from "./Header";
import Pioneer from "./Pioneer";
import ChooseProgram from "./ChooseProgram";
import HomeBlog from "./HomeBlog";
import Footer from "./Footer";

function Home() {
  return (
    <div>
      <Header />
      <Pioneer />
      <ChooseProgram />
      <HomeBlog />
      <Footer />
    </div>
  );
}

export default Home;
