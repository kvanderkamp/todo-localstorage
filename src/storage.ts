/**
 * Storage operations for todos
 */

import type { Todo } from "./types";

const STORAGE_KEY = "todos";

/**
 * Save todos to localStorage
 */
export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * Load todos from localStorage
 */
export function loadTodos(): Todo[] | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as Todo[];
  } catch (e) {
    console.error("Error parsing todos from localStorage:", e);
    return null;
  }
}

/**
 * Clear all todos from localStorage
 */
export function clearTodos(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Load example/default todos
 */
export function getExampleTodos(): Todo[] {
  const baseTime = Date.now();
  return [
    {
      id: baseTime * 1000 + 1,
      text: "Complete the project documentation",
      completed: false,
    },
    {
      id: baseTime * 1000 + 2,
      text: "Review pull requests",
      completed: false,
    },
    { id: baseTime * 1000 + 3, text: "Buy groceries", completed: true },
    {
      id: baseTime * 1000 + 4,
      text: "Schedule team meeting",
      completed: false,
    },
  ];
}
