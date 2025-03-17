import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox } from "antd";
import calendarService from "../../services/calendarService";
import type { TCalendarTask, TCalendarTodo } from "../../types/calendar";
import { Link } from "react-router";
import useCalendarStore from "../../store/calendar";

const CalendarTask = ({ task }: { task: TCalendarTask}) => {
    return (
      <>
        <Link
          to={`/calendarTask/${task.id}`}
          className="w-full md:w-[calc(33%-16px)] lg:w-[calc(25%-16px)]"
        >
          <div
            className={"card flex flex-col w-full text-black shadow-xl rounded-2xl border-black border-2 " + task.color}
          >
            <div className="w-full flex justify-between items-center py-3 px-4 text-2xl font-bold border-b-black border-b-2">
              <span>{task.title}</span>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-2 mb-3">
                {task.todos.length == 0 ? (
                  <p className="text-lg font-bold text-center">No todos</p>
                ) : (
                  task.todos.map((todo: TCalendarTodo) => (
                    <ToDo key={todo.id} task={task} todo={todo} />
                  ))
                )}
              </div>
            </div>
          </div>
        </Link>
      </>
    );
  };
  
  const ToDo = ({ todo, task}: { task: TCalendarTask, todo: TCalendarTodo}) => {
    const {calendarTasksWeek, calendarTasksMonth, calendarTasksYear, setCalendarTasksMonth, setCalendarTasksWeek, setCalendarTasksYear} = useCalendarStore();

    const handleCheckbox = async (id: number) => {
      const updatedTodo = await calendarService.updateCalendar(id, { completed: !todo.completed });

      setCalendarTasksMonth(calendarTasksMonth.map((item: TCalendarTask) =>
        item.id !== task.id ? item : {
          ...task,
          todos: task.todos.map((item: TCalendarTodo) =>
            item.id !== updatedTodo.id ? item : updatedTodo
          ),
        }
      ));
      setCalendarTasksWeek(calendarTasksWeek.map((item: TCalendarTask) =>
        item.id !== task.id ? item : {
          ...task,
          todos: task.todos.map((item: TCalendarTodo) =>
            item.id !== updatedTodo.id ? item : updatedTodo
          ),
        }
      ));
      setCalendarTasksYear(calendarTasksYear.map((item: TCalendarTask) =>
        item.id !== task.id ? item : {
          ...task,
          todos: task.todos.map((item: TCalendarTodo) =>
            item.id !== updatedTodo.id ? item : updatedTodo
          ),
        }
      ));
    };
  
    const deleteTodo = (id: number) => {
      console.log(id);
    };
  
    return (
      <div className="flex gap-4 lg:gap-2">
        <p className="w-full text-lg lg:text-lg lg:pb-1 border-b-black border-b-1">
          {todo.name.charAt(0).toUpperCase() + todo.name.slice(1)}
        </p>
        <div className="flex gap-4 lg:gap-2 items-center">
          <Checkbox
            className="scale-200 text-xl lg:text-lg lg:scale-100"
            onClick={(evt) => {
              evt.stopPropagation();
              evt.preventDefault();
            }}
            onChange={() => {
              handleCheckbox(todo.id);
            }}
            checked={todo.completed}
          />
  
          <Button
            onClick={() => deleteTodo(todo.id)}
            size={window.innerWidth < 768 ? "large" : "small"}
            color="danger"
            variant="outlined"
            icon={<DeleteOutlined />}
          />
        </div>
      </div>
    );
  };
  
export default CalendarTask;