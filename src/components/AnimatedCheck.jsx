import React from "react";
import "../css/usersPrograms.css";

const AnimatedCheck = () => (
  <svg
    className="animated-check"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="check-glow"
      cx="16"
      cy="16"
      r="15"
      stroke="#28a745"
      strokeWidth="2"
      fill="#eafaf1"
    />
    <path
      d="M10 17L15 22L22 12"
      stroke="#28a745"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AnimatedCheck; 