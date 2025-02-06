import { Button, DatePicker, Form, Input } from "antd";
import useTaskContext from "../../context/TasksContext";
import Task from "../../types/task";
import React, { useEffect } from "react";
import dayjs from "dayjs";

const Filter = () => {
  const { tasksNode, setTasks } = useTaskContext();
  const [filterTitle, setFilterTitle] = React.useState<string>("");
  const [filterDate, setFilterDate] = React.useState<string | Date | null>(
    null
  );

  const [form] = Form.useForm();

  const handleFilterTitle = (title: string | null): boolean => {
    if (filterTitle == null || filterTitle == "") return true;
    if (title == null || title == "") return true;

    return title.trim().includes(filterTitle.trim());
  };

  const handleFilterDate = (date: string | Date | null) => {
    if (filterDate == null) return true;

    return dayjs(date)
      .startOf("day")
      .isSame(dayjs(filterDate).startOf("day"));
  };

  useEffect(() => {
    setTasks(
      tasksNode.filter(
        (task: Task) =>  handleFilterTitle(task.title) && handleFilterDate(task.date) 
      )
    );
  }, [filterTitle, filterDate]);

  const handleReset = () => {
    setFilterDate(null);
    setFilterTitle("");
    setTasks(tasksNode);
  };

  return (
    <div className="ml-5">
      <Form layout="inline" form={form} className="flex gap-2">
        <Form.Item>
          <Input
            onChange={(e) => setFilterTitle(e.target.value)}
            value={filterTitle}
            placeholder="Filter by title"
          />
        </Form.Item>
        <Form.Item>
          <DatePicker
            onChange={(e) => setFilterDate(e)}
            value={filterDate}
            placeholder="Filter by date"
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleReset}>Reset</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Filter;
