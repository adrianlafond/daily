export interface Todo {
  done: boolean;
  label: string;
  id: string;
}

export interface Day {
  date: string;
  todos: Todo[];
}

export interface Warning {
  line: number;
  message: string;
}

export interface Todos {
  title: string;
  days: Day[];
  warnings: Warning[];
}
