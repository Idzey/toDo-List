import TasksBlock from "../components/tasksBlock/TasksBlock";
import ControlBlock from "../components/controlBlock/ControlBlock";
import { Divider, Result } from "antd";
import Task from "../types/task";
import useTasksStore from "../store/tasks";
import useFilterStore from "../store/filter";
import useUserStore from "../store/user";

const HomePage = () => {
  const { user } = useUserStore();
  const { tasks } = useTasksStore();
  const { filterTitle } = useFilterStore();

  const filterForTitle = (title: string | null): boolean => {
    if (filterTitle == null || filterTitle == "") return true;
    if (title == null || title == "") return true;

    return title
      .trim()
      .toLowerCase()
      .includes(filterTitle.trim().toLowerCase());
  };

  const filtredTasks = tasks.filter((item: Task) => filterForTitle(item.title));

  return (
    <>
      <div className="w-full">
        <h1 className="text-3xl">To-Do</h1>
        <Divider className="border-b-1 border-b-gray-300" />
      </div>

      {!user ? (
        <Result title="You don't login. Please, login or sign up." />
      ) : (
        <>
          <ControlBlock />
          <TasksBlock tasks={filtredTasks} />
        </>
      )}
    </>
  );
};

export default HomePage;
