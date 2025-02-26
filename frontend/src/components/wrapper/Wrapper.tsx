import { ReactNode } from "react";

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-5 w-full min-h-screen bg-white-gray px-4 py-8 md:px-16 ">
        {children}
    </div>
    );
};

export default Wrapper;
