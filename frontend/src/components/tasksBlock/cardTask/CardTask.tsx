import { Button, Checkbox } from "antd";
import Task from "../../../types/task";
import ModalTask from "../../modal/ModalTask";
import { useState } from "react";
import { Link } from "react-router";
import Todo from "../../../types/todo";
import todoService from "../../../services/todoService";
import useTasksStore from "../../../store/tasks";
import { DeleteOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import taskService from "../../../services/taskService";

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

  const handleOpenTask = async (id?: string | number) => {
    if (id == undefined) return;

    const updatedTask = await taskService.updateTask(id, {
      isOpened: !task.isOpened,
    });

    setTasks(tasks.map((item: Task) => (item.id != id ? item : updatedTask)));
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

      {moreInfo ? (
        <div className="w-full">
          <div
            className="card w-full text-black bg-peach-light shadow-xl rounded-2xl border-black border-2"
            style={{
              backgroundColor: task.color,
            }}
          >
            <div className="flex w-full items-center py-3 border-b-black border-b-2">
              <h2 className="ms-4 text-2xl font-bold ovehflow-hidden">
                <span>
                  {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
                </span>
              </h2>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-2 mb-3">
                {task.todos.length == 0 ? (
                  <p className="text-lg font-bold text-center">No todos</p>
                ) : (
                  task.todos.map((comment) => (
                    <ToDo
                      moreInfo={moreInfo}
                      key={comment.id}
                      todo={comment}
                      task={task}
                      setTask={setTask}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link to={`/task/${task.id}`} className="w-full">
          <div
            className="card flex flex-col w-full text-black bg-peach-light shadow-xl rounded-2xl border-black border-2"
            style={{
              backgroundColor: task.color,
            }}
          >
            <div className={`w-full flex justify-between items-center py-3 px-4 text-2xl font-bold ${task.isOpened && "border-b-black border-b-2"}`}>
              <span>
                {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
              </span>
              <Button
                icon={task.isOpened ? <UpOutlined /> : <DownOutlined />}
                onClick={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  handleOpenTask(task.id);
                }}
              />
            </div>
            {
              task.isOpened && (
                <div className="p-4">
                  <div className="flex flex-col gap-2 mb-3">
                    {task.todos.length == 0 ? (
                      <p className="text-lg font-bold text-center">No todos</p>
                    ) : (
                      task.todos.map((comment) => (
                        <ToDo
                          key={comment.id}
                          todo={comment}
                          task={task}
                          setTask={setTask}
                        />
                      ))
                    )}
                  </div>
                </div>
              )
            }
          </div>
        </Link>
      )}
    </>
  );
};

const ToDo = ({
  task,
  setTask,
  todo,
  moreInfo,
}: {
  task: Task;
  setTask?: (task: Task) => void;
  todo: Todo;
  moreInfo?: boolean;
}) => {
  const { tasks, setTasks } = useTasksStore();
  const handleCheckbox = async (id: string | undefined | number) => {
    if (id == undefined) return;

    const updatedTodo = await todoService.updateTodo(id, {
      completed: !todo.completed,
    });

    setTasks(
      tasks.map((item: Task) =>
        task.id != item.id
          ? item
          : {
              ...item,
              todos: item.todos.map((todoItem: Todo) =>
                todoItem.id != updatedTodo.id ? todoItem : updatedTodo
              ),
            }
      )
    );
    if (setTask) {
      setTask({
        ...task,
        todos: task.todos.map((todoItem: Todo) =>
          todoItem.id != updatedTodo.id ? todoItem : updatedTodo
        ),
      });
    }
  };

  const deleteTodo = async (id: string | undefined | number) => {
    if (id == undefined) return;

    await todoService.deleteTodo(id);

    setTasks(
      tasks.map((item: Task) =>
        task.id != item.id
          ? item
          : {
              ...item,
              todos: item.todos.filter((todoItem: Todo) => todoItem.id != id),
            }
      )
    );

    if (setTask) {
      setTask({
        ...task,
        todos: task.todos.filter((todoItem: Todo) => todoItem.id != id),
      });
    }
  };

  return (
    <div className="flex gap-4 lg:gap-2">
      <p className="w-full text-lg lg:text-lg lg:pb-1 border-b-black border-b-1">
        {todo.name.charAt(0).toUpperCase() + todo.name.slice(1)}
      </p>
      <div className="flex gap-4 lg:gap-2 items-center">
        <Checkbox
          className="scale-200 text-xl lg:text-lg lg:scale-100"
          onClick={(evt) => {
            evt.stopPropagation();
            evt.preventDefault();
          }}
          onChange={() => {
            handleCheckbox(todo.id);
          }}
          checked={todo.completed}
        />

        {moreInfo && (
          <Button
            onClick={() => deleteTodo(todo.id)}
            size={window.innerWidth < 768 ? "large" : "small"}
            color="danger"
            variant="outlined"
            icon={<DeleteOutlined />}
          />
        )}
      </div>
    </div>
  );
};

export default CardTask;
