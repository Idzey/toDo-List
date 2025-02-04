import { Form, Modal, notification } from "antd";
import React, { useEffect } from "react";
import Task from "../../types/task";
import taskService from "../../services/taskService";
import useTaskContext from "../../context/TaskContext";
import dayjs from "dayjs";
import FormModal from "./formModal/FormModal";

const ModalTask = ({
  open,
  setOpen,
  createModal,
  task,
}: {
  task?: Task;
  open: boolean;
  createModal?: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { tasks, setTasks, setTasksNode } = useTaskContext();

  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  const openNotification = (title: string) => {
    notification.success({ message: `Succes, ${title}!`, placement: "bottomRight" });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCreateTask = () => {
    const createTask = async () => {
      try {
        setConfirmLoading(true);
        const values = await form.validateFields();
        const task: Task = await taskService.createTask(values);

        setTasks([...tasks, task]);
        setTasksNode([...tasks, task]);

        setConfirmLoading(false);
        form.resetFields();
        setOpen(false);
        openNotification("was been created");
      } catch {
        setConfirmLoading(false);
      }
    };

    createTask();
  };

  const handleUpdateTask = async () => {
    const id = task?.id || "";
    const createTask = async () => {
      try {
        setConfirmLoading(true);
        const values = await form.validateFields();
        const updateTask: Task = await taskService.updateTask(id, values);

        setTasks(
          tasks.map((task: Task) => (task?.id == id ? updateTask : task))
        );
        setTasksNode(
          tasks.map((task: Task) => (task?.id == id ? updateTask : task))
        );

        setConfirmLoading(false);
        form.resetFields();
        setOpen(false);
        openNotification("task was been updated");
      } catch {
        setConfirmLoading(false);
      }
    };

    createTask();
  };

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        completed: task.completed,
        date: dayjs(task.date),
      });
    }
  }, [open, form, task]);

  const handleForm = createModal ? handleCreateTask : handleUpdateTask;

  return (
    <>
      <Modal
        forceRender={true}
        title={createModal ? "New Task" : `Update Task - ${task?.title}`}
        open={open}
        onOk={handleForm}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div className="mt-4">
          <FormModal
            form={form}
            handleForm={handleForm}
            confirmLoading={confirmLoading}
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalTask;
