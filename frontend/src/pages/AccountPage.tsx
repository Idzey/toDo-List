import { useState } from "react";
import {
  Button,
  Divider,
  Result,
  Form,
  Input,
  Card,
  Avatar,
  Typography,
  Tabs,
  Statistic,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import useUserStore from "../store/user";
import { Link, useNavigate } from "react-router";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../components/notification/Notification";
import userService from "../services/userService";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AccountPage = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [usernameForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  if (!user) {
    return (
      <Result
        status="403"
        title="Not Authorized"
        subTitle="Please log in to access your account settings."
        extra={[
          <Button type="primary" key="login" onClick={() => navigate("/")}>
            Back to Home
          </Button>,
        ]}
      />
    );
  }

  const handleUsernameSubmit = async (values: { username: string }) => {
    setIsSubmitting(true);
    try {
      const updatedUser = await userService.updateUser({
        username: values.username,
      });
      setUser({
        ...user,
        username: updatedUser.username,
      });
      openSuccessNotification("Username updated successfully");
      setIsUsernameEditing(false);
    } catch (error) {
      openErrorNotification("Failed to update username");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values: { newPassword: string }) => {
    setIsSubmitting(true);
    try {
      await userService.updateUser({ password: values.newPassword });
      openSuccessNotification("Password updated successfully");
      setIsPasswordEditing(false);
      passwordForm.resetFields();
    } catch (error) {
      openErrorNotification("Failed to update password");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    try {
      await userService.deleteUser();
      openSuccessNotification("Account deleted successfully");
      setUser(null);
      navigate("/");
    } catch (error) {
      openErrorNotification("Failed to delete account");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const taskCount = user.tasks?.length || 0;
  const calendarTaskCount = user.calendarTasks?.length || 0;

  const memberSince = dayjs()
    .subtract(Math.floor(Math.random() * 365), "day")
    .format("MMMM D, YYYY");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">
          <Link to="/">To-Do</Link> / Account
        </h1>
        <Button type="primary" onClick={() => navigate("/")}>
          Go home
        </Button>
      </div>
      <Divider className="border-b-1 border-b-gray-300" />

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3 bg-gray-50 shadow-md">
          <div className="flex flex-col items-center">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              className="bg-blue-500 mb-4"
            />
            <Title level={2} className="mb-1">
              {user.username}
            </Title>
            <Text type="secondary" className="mb-6">
              <ClockCircleOutlined className="mr-2" />
              Member since {memberSince}
            </Text>

            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <Statistic
                title="Tasks"
                value={taskCount}
                prefix={<CheckCircleOutlined />}
              />
              <Statistic
                title="Calendar Events"
                value={calendarTaskCount}
                prefix={<CalendarOutlined />}
              />
            </div>
          </div>
        </Card>

        <Card className="md:w-2/3 shadow-md">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Account Settings" key="1">
              <div className="px-4 py-2 mb-6 bg-gray-50 rounded-md">
                <Title level={4}>User Profile</Title>
                <Paragraph type="secondary">
                  Manage your account information
                </Paragraph>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <Title level={5}>Username</Title>
                  <Button
                    type="text"
                    icon={
                      isUsernameEditing ? <SaveOutlined /> : <EditOutlined />
                    }
                    onClick={() => setIsUsernameEditing(!isUsernameEditing)}
                  >
                    {isUsernameEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>

                {isUsernameEditing ? (
                  <Form
                    form={usernameForm}
                    layout="vertical"
                    onFinish={handleUsernameSubmit}
                    initialValues={{ username: user.username }}
                  >
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your new username",
                        },
                        {
                          min: 3,
                          message: "Username must be at least 3 characters",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="New username"
                        autoComplete="off"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        block
                      >
                        Update Username
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <div className="py-2 px-4 bg-gray-100 rounded-md">
                    <Text>{user.username}</Text>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Title level={5}>Password</Title>
                  <Button
                    type="text"
                    icon={
                      isPasswordEditing ? <SaveOutlined /> : <EditOutlined />
                    }
                    onClick={() => {
                      setIsPasswordEditing(!isPasswordEditing);
                      if (!isPasswordEditing) {
                        passwordForm.resetFields();
                      }
                    }}
                  >
                    {isPasswordEditing ? "Cancel" : "Change Password"}
                  </Button>
                </div>

                {isPasswordEditing ? (
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordSubmit}
                  >
                    <Form.Item
                      name="newPassword"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your new password",
                        },
                        {
                          min: 6,
                          message: "Password must be at least 6 characters",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="New password"
                        autoComplete="new-password"
                      />
                    </Form.Item>
                    <Form.Item
                      name="confirmPassword"
                      dependencies={["newPassword"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("The two passwords do not match")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        block
                      >
                        Update Password
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <div className="py-2 px-4 bg-gray-100 rounded-md">
                    <Text>••••••••</Text>
                  </div>
                )}
              </div>
            </TabPane>

            <TabPane tab="Account Actions" key="3">
              <div className="px-4 py-2 mb-6 bg-gray-50 rounded-md">
                <Title level={4}>Danger Zone</Title>
                <Paragraph type="secondary">
                  Permanent actions for your account
                </Paragraph>
              </div>

              <div className="border border-red-300 rounded-md p-4">
                <Title level={5} className="text-red-500">
                  Delete Account
                </Title>
                <Paragraph>
                  Once you delete your account, there is no going back. Please
                  be certain.
                </Paragraph>
                <Popconfirm
                  title="Delete Account!"
                  description="Are you sure to delete account???"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={handleDeleteUser}
                >
                  <Button danger>
                    Delete Account
                  </Button>
                </Popconfirm>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
