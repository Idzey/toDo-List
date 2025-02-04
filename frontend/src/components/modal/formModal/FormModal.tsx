import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Switch } from "antd";
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
      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: "Please input your title task!" }]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item label="Completed" name="completed" valuePropName="checked">
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>
    </Form>
  );
};

export default FormModal;
