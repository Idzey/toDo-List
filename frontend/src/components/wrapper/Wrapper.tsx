import React from "react";

import { ReactNode } from "react";

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-5 w-full min-h-screen py-8 px-16 bg-white-gray">
        {children}
    </div>
    );
};

export default Wrapper;
