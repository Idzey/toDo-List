import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import taskService from "../services/taskService";
import Task from "../types/task";
import { openErrorNotification } from "../components/notification/Notification";
import { Button, Card, Divider, Form, Popconfirm } from "antd";
import CardTask from "../components/tasksBlock/cardTask/CardTask";
import TextArea from "antd/es/input/TextArea";
import { FaTrash } from "react-icons/fa6";
import dayjs from "dayjs";
import Comment from "../types/comment";
import commentService from "../services/commentService";
import useTaskContext, { TaskContext } from "../context/TaskContext";

const TaskPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;

      try {
        const data = await taskService.getTask(taskId.toString());
        setTask(data);
      } catch {
        openErrorNotification("Error fetching task");
      }
    };

    fetchTask();
  }, [taskId]);

 
  if (!task) return null;

  return (
    <>
      <TaskContext.Provider value={{ task, setTasks: setTask }}>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">To-Do | Task - {task.title}</h1>
            <Button color="pink" variant="solid" onClick={() => navigate("/")}>
              Go home
            </Button>
          </div>
          <Divider className="border-b-1 border-b-gray-300" />

          <div className="w-full">
            <CardTask setTask={setTask} moreInfo={true} task={task} />

            <div className="mt-8 ">
              <p className="text-2xl my-4">Comments:</p>
              <div className="flex flex-col gap-5">
                <FormComment />

                <div className="flex items-center flex-wrap gap-4">
                  {task.comments && task.comments.length > 0 ? (
                    task.comments.map((comment: Comment) => (
                      <CommentNode key={comment.id} comment={comment} />
                    ))
                  ) : (
                    <p>No comments yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TaskContext.Provider>
    </>
  );
};

const CommentNode = ({ comment }: { comment: Comment }) => {
  const { task, setTasks } = useTaskContext();

  const deleteComment = async () => {
    await commentService.deleteComment(comment.id);

    if (task) {
      setTasks({ ...task, comments: task.comments.filter(c => c.id != comment.id) });
    }
  };

  return (
    <Card
      style={{ minWidth: 300 }}
      title={<p>{dayjs(comment.createdAt).format("hh:mm, MM.DD.YYYY")}</p>}
      extra={
        <Popconfirm
          title="Delete the comment"
          description="Are you sure to delete this comment?"
          onConfirm={deleteComment}
          okText="Yes"
          cancelText="No"
        >
          <Button
            color="danger"
            variant="outlined"
          >
            <FaTrash />
          </Button>
        </Popconfirm>
      }
    >
      {comment.content}
    </Card>
  );
};

const FormComment = () => {
  const [form] = Form.useForm();
  const { task, setTasks } = useTaskContext();

  const handleCreateComment = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    if (!task) return;

    const newComment = await commentService.createComment({
      ...values,
      taskId: task.id,
    });
    setTasks({ ...task, comments: [...task.comments, newComment] });

    form.resetFields();
  };

  return (
    <div className="flex flex-col gap-2">
      <Form onFinish={handleCreateComment} form={form}>
        <Form.Item
          rules={[{ required: true, message: "Please input your comment!" }]}
          name="content"
        >
          <TextArea autoSize={{ minRows: 3 }} placeholder="New comment..." />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" color="primary" variant="outlined">
            Add Comment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TaskPage;
