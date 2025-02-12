import TasksBlock from "../components/tasksBlock/TasksBlock";
import ControlBlock from "../components/controlBlock/ControlBlock";
import { Divider } from "antd";
import Task from "../types/task";
import dayjs from "dayjs";
import useTasksStore from "../store/tasks";
import useFilterStore from "../store/filter";

const HomePage = () => {
  const {tasks} = useTasksStore();
  const {filterTitle, filterDate} = useFilterStore();

  const filterForTitle = (title: string | null): boolean => {
    if (filterTitle == null || filterTitle == "") return true;
    if (title == null || title == "") return true;

    return title.trim().toLowerCase().includes(filterTitle.trim().toLowerCase());
  };

  const filterForDate = (date: Date | null) => {
    if (filterDate == null) return true;

    return dayjs(date)
      .startOf("day")
      .isSame(dayjs(filterDate).startOf("day"));
  };


  const filtredTasks = tasks.filter((item: Task) => filterForTitle(item.title) && filterForDate(item.date));
  return (
    <>
      <div className="w-full">
        <h1 className="text-3xl">To-Do</h1>
        <Divider className="border-b-1 border-b-gray-300" />
      </div>

      <ControlBlock />

      <TasksBlock tasks={filtredTasks} />
    </>
  );
};

export default HomePage;
