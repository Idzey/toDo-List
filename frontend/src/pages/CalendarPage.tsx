import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Divider, Result } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { TCalendarTask } from "../types/calendar";
import useUserStore from "../store/user";
import CalendarTask from "../components/calendar/CalendarTask";
import useCalendarStore from "../store/calendar";

const CalendarPage = () => {
  const {
    calendarTasksWeek, 
    calendarTasksMonth, 
    calendarTasksYear, 
  } = useCalendarStore();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [accordionData, setAccordionData] = useState({
    week: true,
    month: false,
    year: false,
  });

  if (!user) {
    return <Result title="You don't login. Please, login or sign up." />
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">
            <Link to="/">To-Do</Link> / Calendar
          </h1>
          <Button color="pink" variant="solid" onClick={() => navigate("/")}>
            Go home
          </Button>
        </div>
        <Divider className="border-b-1 border-b-gray-300" />

        <div className="mb-6">
          <div className="flex flex-col rounded-2xl border-black border-1">
            <div className={`flex gap-2 p-4 ${accordionData.week && "border-black border-b-1"}`}>
              <Button
                icon={accordionData.week ? <UpOutlined /> : <DownOutlined />}
                onClick={() =>
                  setAccordionData({
                    ...accordionData,
                    week: !accordionData.week,
                  })
                }
              />
              <h2 className="text-2xl font-bold">Week View</h2>
            </div>
            {accordionData.week && (
              <div className="flex flex-wrap gap-4 p-4">
                {calendarTasksWeek.map((task: TCalendarTask) => (
                  <CalendarTask 
                    typeTask="week"
                    key={task.id} 
                    task={task}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-col rounded-2xl border-black border-1">
            <div className={`flex gap-2 p-4 ${accordionData.month && "border-black border-b-1"}`}>
              <Button
                icon={accordionData.month ? <UpOutlined /> : <DownOutlined />}
                onClick={() =>
                  setAccordionData({
                    ...accordionData,
                    month: !accordionData.month,
                  })
                }
              />
              <h2 className="text-2xl font-bold">Month View</h2>
            </div>
            {accordionData.month && (
              <div className="flex flex-wrap gap-4 p-4">
                {calendarTasksMonth.map((task: TCalendarTask) => (
                  <CalendarTask 
                    typeTask="month"
                    key={task.id} 
                    task={task} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="mb-6">
          <div className="flex flex-col rounded-2xl border-black border-1">
            <div className={`flex gap-2 p-4 ${accordionData.year && "border-black border-b-1"}`}>
              <Button
                icon={accordionData.year ? <UpOutlined /> : <DownOutlined />}
                onClick={() =>
                  setAccordionData({
                    ...accordionData,
                    year: !accordionData.year,
                  })
                }
              />
              <h2 className="text-2xl font-bold">Year View</h2>
            </div>
            {accordionData.year && (
              <div className="flex flex-wrap gap-4 p-4">
                {calendarTasksYear.map((task: TCalendarTask) => (
                  <CalendarTask 
                    typeTask="year"
                    key={task.id} 
                    task={task} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
