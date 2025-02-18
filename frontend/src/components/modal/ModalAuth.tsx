import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Form, FormInstance, Input, Modal } from "antd";
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
  const { setUserToken, setUser } = useUserStore();
  const { setTasks } = useTasksStore();

  const handleCancel = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();

  const handleForm = login
    ? async () => {
        try {
          setConfirmLoading(true);
          const values = await form.validateFields();
          const data = await userService.signupUser({username: values.usernameLogin, password: values.passwordLogin});

          window.localStorage.setItem("userToken", data.token);
          await taskService.setToken(data.token);
          setUserToken(data.token);
          setUser({ username: data.username, tasks: data.tasks });

          const fetchTasks: Tasks = await taskService.getAll();
          setTasks(fetchTasks);

          openSuccessNotification("you are logged in to your account");
          setConfirmLoading(false);
          setOpen(false);
          navigate("/");
        } catch {
          setConfirmLoading(false);
          openErrorNotification("not register");
          setOpen(false);
        }
      }
      : async () => {
        try {
          setConfirmLoading(true);
          const values = await form.validateFields();
          await userService.loginUser({username: values.usernameSignup, password: values.passwordSignup});

          openSuccessNotification("you have registered an account");
          setConfirmLoading(false);
          setOpen(false);
          navigate("/");
        } catch {
          setConfirmLoading(false);
          openErrorNotification("not register");
          setOpen(false);
        }
      };

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
          <AuthForm
            login={login}
            form={form}
            handleForm={handleForm}
            confirmLoading={confirmLoading}
          />
        </div>
      </Modal>
    </>
  );
};

const AuthForm = ({
  form,
  confirmLoading,
  handleForm,
  login
}: {
  login: boolean;
  form: FormInstance;
  confirmLoading: boolean;
  handleForm: () => void;
}) => {
  return (
    <Form
      key={login ? "login": "signup"}
      disabled={confirmLoading}
      form={form}
      labelCol={{ span: 5 }}
      style={{ maxWidth: 1000 }}
      onFinish={handleForm}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name={"username" + (login ? "Login": "Signup")}
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="..." />
      </Form.Item>
      <Form.Item
        label="Password"
        name={"password" + (login ? "Login": "Signup")}
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          placeholder="..."
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
    </Form>
  );
};

export default ModalAuth;
