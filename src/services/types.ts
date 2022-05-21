export interface Todos {
  title: string;
  days: {
    title: string;
    todos: {
      done: boolean;
      label: string;
    }[];
  }[];
}
