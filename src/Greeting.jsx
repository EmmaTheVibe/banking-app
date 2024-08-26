import React from "react";
import "./App.css";
const Greeting = () => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "GOOD MORNING";
    } else if (currentHour < 18) {
      return "GOOD AFTERNOON";
    } else {
      return "GOOD EVENING";
    }
  };

  const greeting = getGreeting();

  return <p>{greeting}</p>;
};

export default Greeting;
