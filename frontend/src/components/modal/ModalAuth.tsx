import { Form, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../notification/Notification";
import userService from "../../services/userService";
import useUserStore from "../../store/user";
import taskService from "../../services/taskService";
import Tasks from "../../types/tasks";
import useTasksStore from "../../store/tasks";
import LoginForm from "./formModal/LoginForm";
import SignupForm from "./formModal/SignupForm";
import axios from "axios";

const ModalAuth = ({
  login,
  open,
  setOpen,
}: {
  login: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { setTasks } = useTasksStore();

  const handleCancel = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();

  const handleLogin = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();

      if (values) {
        const data = await userService.loginUser({email: values.emailLogin, password: values.passwordLogin});
  
        setUser({ username: data.username, tasks: data.tasks });
  
        const fetchTasks: Tasks = await taskService.getAll();
        setTasks(fetchTasks);
  
        openSuccessNotification("you are logged in to your account");
        setConfirmLoading(false);
        setOpen(false);
        navigate("/");
      }
    } catch {
      setConfirmLoading(false);
      openErrorNotification("not register");
    }
  };

  const handleSignup = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();

      if (values) {
        await userService.signupUser({username: values.usernameSignup, email: values.emailSignup, password: values.passwordSignup});
  
        openSuccessNotification("a confirmation link has been sent to your email address. Please check your inbox and follow the instructions to verify your account.");
        setConfirmLoading(false);
        setOpen(false);
        navigate("/");
      }
    } catch (error) {
      setConfirmLoading(false);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error === "email already exists") return openErrorNotification("email already exists");
        
        openErrorNotification("not register, please try again");
      }
    }
  };

  const handleForm = login ? handleLogin : handleSignup;

  return (
    <>
      <Modal
        forceRender={true}
        title={login ? "Login" : `Sign up`}
        open={open}
        onOk={handleForm}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div className="mt-4">
          {login ? <LoginForm
            form={form}
            handleForm={handleLogin}
            confirmLoading={confirmLoading}
          /> : 
          <SignupForm
            form={form}
            handleForm={handleSignup}
            confirmLoading={confirmLoading}
          />
          }
        </div>
      </Modal>
    </>
  );
};

export default ModalAuth;
