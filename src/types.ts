/**
 * Todo item interface
 */
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/**
 * Filter type for displaying todos
 */
export type FilterType = "all" | "active" | "completed";
