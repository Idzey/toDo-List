import Task from "../../../types/task";
import { FaTrash, FaPen, FaRegCalendar, FaRegComment } from "react-icons/fa6";
import { Button, Checkbox, Popconfirm, Switch } from "antd";
import taskService from "../../../services/taskService";
import ModalTask from "../../modal/ModalTask";
import { useState } from "react";
import DateTask from "./dateTask/DateTask";
import { Link, useNavigate } from "react-router";
import { openSuccessNotification } from "../../notification/Notification";
import dayjs from "dayjs";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import useTasksStore from "../../../store/tasks";

const CardTask = ({
  task,
  moreInfo,
  setTask,
}: {
  task: Task;
  moreInfo?: boolean;
  setTask?: (task: Task) => void;
}) => {
  const { tasks, setTasks } = useTasksStore();
  const [open, setOpen] = useState(false);

  const handleCheckbox = async (id: string | undefined | number) => {
    if (id == undefined) return;

    const updatedTask: Task = await taskService.updateTask(id, {
      completed: !task.completed,
    });

    setTasks(
      tasks.map((task: Task) =>
        task.id == updatedTask.id ? updatedTask : task
      )
    );

    if (setTask) {
      setTask(updatedTask);
    }
  };

  return (
    <>
      <ModalTask
        open={open}
        setOpen={setOpen}
        task={task}
        setTask={setTask}
        createModal={false}
      />

      <Link
        to={`/task/${task.id}`}
        className={`w-full ${moreInfo && `cursor-default`}`}
      >
        <div
          className={`items-center border-1 border-gray-300 rounded-md p-4 ${
            task.completed && `text-gray-700 bg-gray-300`
          }`}
        >
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="flex gap-2 items-start">
                {moreInfo ? (
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={task.completed}
                    onChange={() => handleCheckbox(task.id)}
                  />
                ) : (
                  <Checkbox
                    style={{ transform: "scale(1.5)" }}
                    checked={task.completed}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCheckbox(task.id);
                    }}
                  />
                )}

                <DataTask moreInfo={moreInfo} task={task} />
              </div>
            </div>

            <GroupButton moreInfo={moreInfo} task={task} setOpen={setOpen} />
          </div>

          {moreInfo && (
            <p className="text-lg text-gray-500 mt-4 text-right">
              <span className="font-bold">Created:</span>{" "}
              {dayjs(task.createdAt).format("dddd, MM.DD.YYYY")}
            </p>
          )}
        </div>
      </Link>
    </>
  );
};

const DataTask = ({ task, moreInfo }: { task: Task; moreInfo?: boolean }) => {
  return (
    <div className="ml-4">
      <p className={`text-xl ${task.completed && `line-through`}`}>
        {task.title}
      </p>
      {(!task.completed || moreInfo) && (
        <div className="mt-1 flex gap-2 items-center text-gray-500">
          <div className="flex justify-center items-center">
            <FaRegCalendar />
            <DateTask date={task.date} />
          </div>
          {task.comments && task.comments.length > 0 && (
            <div className="flex justify items-center">
              <FaRegComment />
              <span className="ml-1">{task.comments.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const GroupButton = ({
  task,
  setOpen,
  moreInfo,
}: {
  task: Task;
  setOpen: (open: boolean) => void;
  moreInfo?: boolean;
}) => {
  const { setTasks, tasks } = useTasksStore();
  const navigate = useNavigate();

  const handleDeleteTask = async (id: string | undefined | number) => {
    if (id == undefined) return;

    await taskService.deleteTask(id);
    openSuccessNotification("task was been deleted");
    setTasks(tasks.filter((task: Task) => task.id != id));
    if (moreInfo) navigate("/");
  };

  return (
    <div className="flex gap-2 items-center">
      <div>
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onCancel={(e) => {
            e?.preventDefault();
            e?.stopPropagation();
          }}
          onConfirm={(e) => {
            e?.preventDefault();
            e?.stopPropagation();
            handleDeleteTask(task.id);
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button
            color="danger"
            variant="solid"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FaTrash /> Delete
          </Button>
        </Popconfirm>
      </div>
      {(!task.completed || moreInfo) && (
        <div>
          <Button
            color="primary"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
            }}
          >
            <FaPen /> Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default CardTask;
