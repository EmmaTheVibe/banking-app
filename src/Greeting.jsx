import React from "react";
import "./App.css";
const Greeting = () => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const greeting = getGreeting();

  return <p>{greeting}</p>;
};

export default Greeting;
