import React from "react";

const TasksBlock = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col gap-4 my-2">
      {children}
    </div>
  );
};

export default TasksBlock;
