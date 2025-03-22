type TCalendarTodo = {
    id: number,
    name: string,
    completed: boolean,
    user: string | number,
    date: Date
};

type TCalendarTask = {
    id: number,
    title: string,
    todos: TCalendarTodo[],
    date: Date
};


export type {
    TCalendarTodo,
    TCalendarTask
};