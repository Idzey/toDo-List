import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import taskService from "../services/taskService";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../components/notification/Notification";
import { Button, Divider, Form, Input, Popconfirm, Result, Spin } from "antd";
import CardTask from "../components/tasksBlock/cardTask/CardTask";
import todoService from "../services/todoService";
import Task from "../types/task";
import useTasksStore from "../store/tasks";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ModalTask from "../components/modal/ModalTask";
import calendarService from "../services/calendarService";
import type { TCalendarTask, TCalendarTodo } from "../types/calendar";
import CalendarTask from "../components/calendar/CalendarTask";
import useCalendarStore from "../store/calendar";

const TaskPage = ({ isCalendar }: { isCalendar?: boolean }) => {
  const { taskId } = useParams();
  const [selectedTask, setSelectedTask] = useState<Task | TCalendarTask>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { calendarTasksMonth, calendarTasksWeek, calendarTasksYear } =
    useCalendarStore();
  const [searchParams] = useSearchParams();
  const typeTask =
    (searchParams.get("typeTask") as "week" | "month" | "year") || "month";

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;

      setIsLoading(true);
      try {
        if (isCalendar) {
          let task: TCalendarTask | undefined;

          switch (typeTask) {
            case "week":
              task = calendarTasksWeek.find(
                (item: TCalendarTask) => item.id === Number(taskId)
              );
              break;
            case "month":
              task = calendarTasksMonth.find(
                (item: TCalendarTask) => item.id === Number(taskId)
              );
              break;
            case "year":
              task = calendarTasksYear.find(
                (item: TCalendarTask) => item.id === Number(taskId)
              );
              break;
          }

          setSelectedTask(task);
        } else {
          const data = await taskService.getTask(taskId.toString());
          setSelectedTask(data);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        openErrorNotification("Error fetching task");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [
    taskId,
    isCalendar,
    searchParams,
    calendarTasksMonth,
    calendarTasksWeek,
    calendarTasksYear,
    typeTask,
  ]);

  if (isLoading) return <Spin size="large" fullscreen />;

  if (isError) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, no data."
        extra={[
          <Button type="primary" key="console" onClick={() => navigate("/")}>
            Go Home
          </Button>,
        ]}
      />
    );
  }

  if (!selectedTask) return null;

  return (
    <>
      {selectedTask && "createdAt" in selectedTask && (
        <ModalTask
          task={selectedTask}
          setTask={setSelectedTask}
          open={openModal}
          setOpen={setOpenModal}
        />
      )}
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">
              <Link to="/">To-Do</Link> /{" "}
              {isCalendar && (
                <>
                  <Link to="/calendar">Calendar</Link> /
                </>
              )}{" "}
              {selectedTask.title}
            </h1>
            <Button color="pink" variant="solid" onClick={() => navigate("/")}>
              Go home
            </Button>
          </div>
          <Divider className="border-b-1 border-b-gray-300" />
          <div className="lg:px-40 flex justify-center">
            {selectedTask && "createdAt" in selectedTask ? (
              <CardTask
                setTask={setSelectedTask}
                moreInfo={true}
                task={selectedTask}
              />
            ) : (
              <CalendarTask typeTask={typeTask} task={selectedTask} />
            )}
          </div>
        </div>

        <div className="w-full flex">
          <FormTodo
            isCalendar={isCalendar}
            setModalOpen={setOpenModal}
            task={selectedTask}
            setTask={setSelectedTask}
          />
        </div>
      </div>
    </>
  );
};

const FormTodo = ({
  task,
  setTask,
  setModalOpen,
  isCalendar,
}: {
  task: Task | TCalendarTask;
  setTask: (task: Task | TCalendarTask) => void;
  setModalOpen: (open: boolean) => void;
  isCalendar?: boolean;
}) => {
  const [form] = Form.useForm();
  const { tasks, setTasks } = useTasksStore();
  const { generateCalendar } = useCalendarStore();
  const navigate = useNavigate();

  const handleCreateTodo = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    if (!task) return;

    try {
      if (task && "createdAt" in task) {
        const newTodo = await todoService.createTodo({
          ...values,
          taskId: task.id,
        });

        setTasks(
          tasks.map((item: Task) =>
            item.id !== task.id
              ? item
              : { ...task, todos: [newTodo, ...task.todos] }
          )
        );
        setTask({ ...task, todos: [newTodo, ...task.todos] });
        openSuccessNotification("Todo added successfully");
      } else {
        const newTodo = await calendarService.createCalendar({
          ...values,
          taskId: task.id,
          date: task.date,
        });

        generateCalendar();

        setTask({
          ...task,
          todos: [...(task.todos || []), newTodo],
        });
        openSuccessNotification("Calendar todo added successfully");
      }

      form.resetFields();
    } catch (error) {
      console.error("Error creating todo:", error);
      openErrorNotification("Failed to create todo");
    }
  };

  const deleteTask = async (taskId: string | number) => {
    try {
      if (isCalendar) {
        (task.todos as TCalendarTodo[]).forEach(async (todo: TCalendarTodo) => {
          await calendarService.deleteCalendar(todo.id);

          generateCalendar();
        });

        navigate("/calendar");
        openSuccessNotification("Calendar task deleted");
      } else {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter((item: Task) => item.id !== taskId));
        navigate("/");
        openSuccessNotification("Task deleted");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      openErrorNotification("Failed to delete task");
    }
  };

  return (
    <div className="w-full h-full lg:h-3/4 py-4 flex flex-col gap-4 justify-between items-center">
      <Form
        onFinish={handleCreateTodo}
        requiredMark={false}
        form={form}
        layout="vertical"
        className="w-full py-4 md:w-1/2"
      >
        <Form.Item
          label={
            <span className="font-bold text-xl lg:text-2xl">New todo</span>
          }
          rules={[
            { required: true, message: "Please input title for your todo!" },
          ]}
          name="name"
          className="w-full"
        >
          <Input
            placeholder="New todo..."
            className="text-lg lg:text-xl py-2 px-4"
          />
        </Form.Item>
        <Form.Item className="w-full flex justify-end">
          <Button
            htmlType="submit"
            color="primary"
            variant="outlined"
            className="text-lg lg:text-xl px-6 py-3"
          >
            Add Todo
          </Button>
        </Form.Item>
      </Form>

      <div className="flex items-center gap-4">
        {!isCalendar && (
          <Button
            onClick={() => setModalOpen(true)}
            size="large"
            color="primary"
            variant="solid"
            icon={<PlusCircleOutlined />}
          >
            Update task
          </Button>
        )}

        <Popconfirm
          title={`Delete the ${isCalendar ? "calendar task" : "task"}`}
          description={`Are you sure to delete this ${
            isCalendar ? "calendar task" : "task"
          }?`}
          onConfirm={() => deleteTask(task.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            size="large"
            color="danger"
            variant="solid"
            icon={<DeleteOutlined />}
          >
            Delete {isCalendar ? "calendar task" : "task"}
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default TaskPage;
