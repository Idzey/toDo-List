import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Form, FormInstance, Input } from "antd";

const LoginForm = ({
  form,
  confirmLoading,
  handleForm,
}: {
  form: FormInstance;
  confirmLoading: boolean;
  handleForm: () => void;
}) => {

  return (
    <Form
      key="login"
      disabled={confirmLoading}
      form={form}
      labelCol={{ span: 5 }}
      style={{ maxWidth: 1000 }}
      onFinish={handleForm}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="emailLogin"
        rules={[{ required: true, type: "email",  message: "Please input your email!" }]}
      >
        <Input placeholder="..." />
      </Form.Item>
      <Form.Item
        label="Password"
        name="passwordLogin"
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

export default LoginForm;