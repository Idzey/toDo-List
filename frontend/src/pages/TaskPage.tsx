import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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

const TaskPage = () => {
  const { taskId } = useParams();
  const [selectedTask, setSelectedTask] = useState<Task>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;

      setIsLoading(true);
      try {
        const data = await taskService.getTask(taskId.toString());
        setSelectedTask(data);
      } catch {
        openErrorNotification("Error fetching task");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

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
      <ModalTask
        task={selectedTask}
        setTask={setSelectedTask}
        open={openModal}
        setOpen={setOpenModal}
      />
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">
            <Link to="/">To-Do</Link> / {selectedTask.title}
          </h1>
          <Button color="pink" variant="solid" onClick={() => navigate("/")}>
            Go home
          </Button>
        </div>
        <Divider className="border-b-1 border-b-gray-300" />
        <div className="lg:px-10 flex justify-center">
          <CardTask
            setTask={setSelectedTask}
            moreInfo={true}
            task={selectedTask}
          />
        </div>

        <div className="h-3/4 w-full flex">
          <FormTodo
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
}: {
  task: Task;
  setTask: (task: Task) => void;
  setModalOpen: (open: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const { tasks, setTasks } = useTasksStore();
  const navigate = useNavigate();

  const handleCreateTodo = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    if (!task) return;

    const newTodo = await todoService.createTodo({
      ...values,
      taskId: task.id,
    });

    setTasks(
      tasks.map((item: Task) =>
        item.id != task.id ? item : { ...task, todos: [newTodo, ...task.todos] }
      )
    );
    setTask({ ...task, todos: [newTodo, ...task.todos] });

    form.resetFields();
  };

  const deleteTask = async (taskId: string | number) => {
    await taskService.deleteTask(taskId);
    setTasks(tasks.filter((item: Task) => item.id !== taskId));
    navigate("/");
    openSuccessNotification("Task deleted");
  };

  return (
    <div className="w-full h-full lg:h-3/4 py-4 md:mt-8 lg:mt-16 flex flex-col gap-4 justify-between items-center">
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
                { required: true, message: "Please input title your todo!" },
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
        <Button
          onClick={() => setModalOpen(true)}
          size="large"
          color="primary"
          variant="solid"
          icon={<PlusCircleOutlined />}
        >
          Update task
        </Button>

        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
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
            Delete task
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default TaskPage;
