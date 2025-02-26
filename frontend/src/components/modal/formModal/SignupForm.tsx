import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Form, FormInstance, Input } from "antd";

const SignupForm = ({
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
      key="signup"
      disabled={confirmLoading}
      form={form}
      labelCol={{ span: 5 }}
      style={{ maxWidth: 1000 }}
      onFinish={handleForm}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="usernameSignup"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="..." />
      </Form.Item>
      <Form.Item
        label="Email"
        name="emailSignup"
        rules={[{ required: true, type: "email", message: "Please input your email!" }]}
      >
        <Input type="email" placeholder="..." />
      </Form.Item>
      <Form.Item
        label="Password"
        name="passwordSignup"
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

export default SignupForm;
