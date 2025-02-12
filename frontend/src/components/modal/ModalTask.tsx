import { Form, Modal } from "antd";
import React, { useEffect } from "react";
import Task from "../../types/task";
import taskService from "../../services/taskService";
import dayjs from "dayjs";
import FormModal from "./formModal/FormModal";
import { openSuccessNotification } from "../notification/Notification";
import useTasksStore from "../../store/tasks";

const ModalTask = ({
  open,
  setOpen,
  createModal,
  task,
  setTask,
}: {
  task?: Task;
  setTask?: (task: Task) => void;
  open: boolean;
  createModal?: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { tasks, setTasks } = useTasksStore();

  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

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

        setConfirmLoading(false);
        form.resetFields();
        setOpen(false);
        openSuccessNotification("was been created");
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

        setConfirmLoading(false);
        form.resetFields();
        setOpen(false);

        if (setTask) {
          setTask(updateTask);
        }

        openSuccessNotification("task was been updated");
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
