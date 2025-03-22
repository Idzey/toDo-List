import Tasks from "../../types/tasks";
import Task from "../../types/task";
import CardTask from "./cardTask/CardTask";

const TasksBlock = ({ tasks }: { tasks: Tasks }) => {
  if (tasks.length == 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-3xl mb-20">Yet not tasks.</h1>
      </div>
    )
  }

  return (
    <div className="flex flex-row flex-wrap gap-4 my-2">
      {tasks.map((task: Task) => (
        <div className="flex md:w-[calc(33%-16px)] lg:w-[calc(25%-16px)]">
          <CardTask task={task} key={task.id} />
        </div>
      ))}
    </div>
  );
};

export default TasksBlock;
