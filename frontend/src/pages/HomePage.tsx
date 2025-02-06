import TasksBlock from "../components/tasksBlock/TasksBlock";
import CardTask from "../components/tasksBlock/cardTask/CardTask";
import ControlBlock from "../components/controlBlock/ControlBlock";
import { Divider } from "antd";
import Task from "../types/task";
import useTaskContext from "../context/TasksContext";

const HomePage = () => {
  const {tasks} = useTaskContext();
  return (
    <>
      <div className="w-full">
        <h1 className="text-3xl">To-Do</h1>
        <Divider className="border-b-1 border-b-gray-300" />
      </div>

      <ControlBlock />

      <TasksBlock>
        {tasks.map((task: Task) => (
          <CardTask task={task} key={task.id} />
        ))}
      </TasksBlock>
    </>
  );
};

export default HomePage;
