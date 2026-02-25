/**
 * Main Todo Application class
 */

import type { Todo, FilterType } from "./types";
import { saveTodos, loadTodos, clearTodos, getExampleTodos } from "./storage";
import { querySelector, querySelectorAll } from "./utils";
import { renderTodoList } from "./renderer";

export class TodoApp {
  private todos: Todo[] = [];
  private currentFilter: FilterType = "all";
  private editingId: number | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.loadFromLocalStorage();
    this.setupEventListeners();
    this.render();
  }

  private setupEventListeners(): void {
    // Add todo
    const addBtn = querySelector<HTMLButtonElement>("#addBtn");
    const todoInput = querySelector<HTMLInputElement>("#todoInput");

    addBtn?.addEventListener("click", () => this.addTodo());
    todoInput?.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        this.addTodo();
      }
    });

    // Filter buttons
    querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLButtonElement;
        const filter = target.dataset.filter as FilterType;
        this.setFilter(filter);
      });
    });

    // Clear completed
    const clearCompletedBtn =
      querySelector<HTMLButtonElement>("#clearCompleted");
    clearCompletedBtn?.addEventListener("click", () => {
      this.clearCompleted();
    });

    // Reset button
    const resetBtn = querySelector<HTMLButtonElement>("#resetBtn");
    resetBtn?.addEventListener("click", () => {
      this.resetAll();
    });
  }

  private addTodo(): void {
    const input = querySelector<HTMLInputElement>("#todoInput");
    if (!input) return;

    const text = input.value.trim();
    if (text === "") return;

    const todo: Todo = {
      id: Date.now(),
      text: text,
      completed: false,
    };

    this.todos.push(todo);
    input.value = "";
    this.saveToLocalStorage();
    this.render();
  }

  private toggleTodo(id: number): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToLocalStorage();
      this.render();
    }
  }

  private deleteTodo(id: number): void {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.saveToLocalStorage();
    this.render();
  }

  private startEdit(id: number): void {
    this.editingId = id;
    this.render();

    // Focus on edit input
    const editInput = querySelector<HTMLInputElement>(`[data-edit-id="${id}"]`);
    if (editInput) {
      editInput.focus();
      editInput.select();
    }
  }

  private saveEdit(id: number): void {
    const editInput = querySelector<HTMLInputElement>(`[data-edit-id="${id}"]`);
    if (!editInput) return;

    const newText = editInput.value.trim();
    if (newText === "") {
      this.deleteTodo(id);
      return;
    }

    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.text = newText;
      this.editingId = null;
      this.saveToLocalStorage();
      this.render();
    }
  }

  private cancelEdit(): void {
    this.editingId = null;
    this.render();
  }

  private reorderTodo(draggedId: number, targetId: number): void {
    const draggedTodo = this.todos.find((t) => t.id === draggedId);
    const targetTodo = this.todos.find((t) => t.id === targetId);

    if (!draggedTodo || !targetTodo) return;

    // Prevent reordering between active and completed sections
    if (draggedTodo.completed !== targetTodo.completed) return;

    const draggedIndex = this.todos.findIndex((t) => t.id === draggedId);
    const targetIndex = this.todos.findIndex((t) => t.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedItem] = this.todos.splice(draggedIndex, 1);
    this.todos.splice(targetIndex, 0, draggedItem);

    this.saveToLocalStorage();
    this.render();
  }

  private setFilter(filter: FilterType): void {
    this.currentFilter = filter;

    querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.filter === filter) {
        btn.classList.add("active");
      }
    });

    this.render();
  }

  private clearCompleted(): void {
    this.todos = this.todos.filter((t) => !t.completed);
    this.saveToLocalStorage();
    this.render();
  }

  private resetAll(): void {
    if (
      confirm(
        "Are you sure you want to reset all todos? This will clear everything and load example items.",
      )
    ) {
      this.todos = [];
      this.loadExampleItems();
      this.render();
    }
  }

  private getFilteredTodos(): Todo[] {
    switch (this.currentFilter) {
      case "active":
        return this.todos.filter((t) => !t.completed);
      case "completed":
        return this.todos.filter((t) => t.completed);
      default:
        return this.todos;
    }
  }

  private render(): void {
    const filteredTodos = this.getFilteredTodos();
    renderTodoList(
      this.todos,
      filteredTodos,
      this.currentFilter,
      this.editingId,
      {
        onToggle: (id) => this.toggleTodo(id),
        onEdit: (id) => this.startEdit(id),
        onSave: (id) => this.saveEdit(id),
        onCancel: () => this.cancelEdit(),
        onDelete: (id) => this.deleteTodo(id),
        onReorder: (draggedId, targetId) =>
          this.reorderTodo(draggedId, targetId),
      },
    );
  }

  private saveToLocalStorage(): void {
    saveTodos(this.todos);
  }

  private loadFromLocalStorage(): void {
    const stored = loadTodos();
    if (stored) {
      this.todos = stored;
    } else {
      this.loadExampleItems();
    }
  }

  private loadExampleItems(): void {
    this.todos = getExampleTodos();
    this.saveToLocalStorage();
  }
}
