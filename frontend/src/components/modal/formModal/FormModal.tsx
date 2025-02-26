import { Form, Input } from "antd";
import Task from "../../../types/task";
import { FormInstance } from "antd/es/form";

const FormModal = ({
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
      disabled={confirmLoading}
      form={form}
      labelCol={{ span: 5 }}
      style={{ maxWidth: 800 }}
      onFinish={handleForm}
      autoComplete="off"
    >
      <Form.Item<Task>
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input your title task!" }]}
      >
        <Input autoFocus={true} />
      </Form.Item>
    </Form>
  );
};

export default FormModal;
