import dayjs from "dayjs";
const DateTask = ({ date }: { date: string | Date | string | undefined}) => {
  if (!date) return;
  const checkTomorrow = (date: string | Date) => {
    date = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    return date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  };

  let dateFormatted: string | null;
  let isTomorrow = false;
  switch (true) {
    case checkTomorrow(date):
      isTomorrow = true;
      dateFormatted = "Tomorrow";
      break;
    default:
      dateFormatted = dayjs(date).format("ddd M, YYYY");
  }

  return <span className={`ml-1 ${isTomorrow && `text-yellow-500`}`}>{dateFormatted}</span>;
};

export default DateTask;
