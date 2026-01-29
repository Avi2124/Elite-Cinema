import React from "react";

const BlurCircle = ({ top, left, right, bottom }) => {
  return (
    <div
      className="pointer-events-none absolute -z-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
      style={{ top, left, right, bottom }}
    />
  );
};

export default BlurCircle;
