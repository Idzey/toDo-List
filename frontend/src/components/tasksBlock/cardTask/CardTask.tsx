import Task from "../../../types/task";
import { FaTrash, FaPen, FaRegCalendar, FaRegComment } from "react-icons/fa6";
import { Button, Checkbox, notification, Popconfirm } from "antd";
import taskService from "../../../services/taskService";
import useTaskContext from "../../../context/TaskContext";
import ModalTask from "../../modal/ModalTask";
import { useState } from "react";
import DateTask from "./dateTask/DateTask";

const CardTask = ({ task }: { task: Task }) => {
  const { tasks, setTasks, setTasksNode } = useTaskContext();
  const [open, setOpen] = useState(false);


  const openNotification = (title: string) => {
    notification.success({ message: `Succes, ${title}!`, placement: "bottomRight" });
  };

  const handleDeleteTask = async (id: string | undefined | number) => {
    if (id == undefined) return;

    openNotification("task was been deleted");
    await taskService.deleteTask(id);
    setTasks(tasks.filter((task: Task) => task.id != id));
    setTasksNode(tasks.filter((task: Task) => task.id != id));
  };

  const handleCheckbox = async (id: string | undefined | number) => {
    if (id == undefined) return;

    const updatedTask = await taskService.updateTask(id, {
      completed: !task.completed,
    });
    setTasks(
      tasks.map((task: Task) =>
        task.id == updatedTask.id ? updatedTask : task
      )
    );
  };

  return (
    <>
      <div
        className={`flex justify-between items-center border-1 border-gray-300 rounded-md p-4 ${
          task.completed && `text-gray-700 bg-gray-300`
        }`}
      >
        <div className="flex flex-col">
          <div className="flex gap-2 items-start">
            <Checkbox
              style={{ transform: "scale(1.5)" }}
              checked={task.completed}
              onClick={() => handleCheckbox(task.id)}
            />
            <ModalTask
              open={open}
              setOpen={setOpen}
              task={task}
              createModal={false}
            />

            <div className={`ml-3 ${task.completed && `line-through`}`}>
              <p className="text-xl">{task.title}</p>
              {!task.completed && (
                <div className="mt-1 flex gap-2 items-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <FaRegCalendar />
                    <DateTask date={task.date} />
                  </div>
                  {task.comments > 0 && (
                    <div className="flex justify items-center">
                      <FaRegComment />
                      <span className="ml-1">{task.comments}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => handleDeleteTask(task.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button color="danger" variant="solid">
                <FaTrash /> Delete
              </Button>
            </Popconfirm>
          </div>
          {!task.completed && (
            <div>
              <Button color="primary" variant="solid" onClick={() => setOpen(true)}>
                <FaPen /> Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CardTask;
