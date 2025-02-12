import Tasks from "../../types/tasks";
import Task from "../../types/task";
import CardTask from "./cardTask/CardTask";

const TasksBlock = ({ tasks }: { tasks: Tasks }) => {
  return (
    <div className="flex flex-col gap-4 my-2">
      {tasks.map((task: Task) => (
        <CardTask task={task} key={task.id} />
      ))}
    </div>
  );
};

export default TasksBlock;
