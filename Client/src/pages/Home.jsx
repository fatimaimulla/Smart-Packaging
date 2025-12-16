import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Hero from "../components/Home/Hero";
import Steps from "../components/Home/Steps";

const Home = () => {
  return (
    <div>
      <Header></Header>
      <Hero></Hero>
      <Steps></Steps>
      <Footer></Footer>
    </div>
  );
};

export default Home;
