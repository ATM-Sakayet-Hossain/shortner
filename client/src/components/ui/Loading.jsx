import React from "react";

const Loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin w-12 h-12 rounded-full border-b-2 border-slate-700"></div>
    </div>
  );
};

export default Loading;
