/**
 * Main Todo Application class
 */
import { saveTodos, loadTodos, getExampleTodos } from "./storage";
import { querySelector, querySelectorAll } from "./utils";
import { renderTodoList } from "./renderer";
export class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = "all";
        this.editingId = null;
        this.init();
    }
    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.render();
    }
    setupEventListeners() {
        // Add todo
        const addBtn = querySelector("#addBtn");
        const todoInput = querySelector("#todoInput");
        addBtn?.addEventListener("click", () => this.addTodo());
        todoInput?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.addTodo();
            }
        });
        // Filter buttons
        querySelectorAll(".filter-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const target = e.target;
                const filter = target.dataset.filter;
                this.setFilter(filter);
            });
        });
        // Clear completed
        const clearCompletedBtn = querySelector("#clearCompleted");
        clearCompletedBtn?.addEventListener("click", () => {
            this.clearCompleted();
        });
        // Reset button
        const resetBtn = querySelector("#resetBtn");
        resetBtn?.addEventListener("click", () => {
            this.resetAll();
        });
    }
    addTodo() {
        const input = querySelector("#todoInput");
        if (!input)
            return;
        const text = input.value.trim();
        if (text === "")
            return;
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
        };
        this.todos.push(todo);
        input.value = "";
        this.saveToLocalStorage();
        this.render();
    }
    toggleTodo(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }
    deleteTodo(id) {
        this.todos = this.todos.filter((t) => t.id !== id);
        this.saveToLocalStorage();
        this.render();
    }
    startEdit(id) {
        this.editingId = id;
        this.render();
        // Focus on edit input
        const editInput = querySelector(`[data-edit-id="${id}"]`);
        if (editInput) {
            editInput.focus();
            editInput.select();
        }
    }
    saveEdit(id) {
        const editInput = querySelector(`[data-edit-id="${id}"]`);
        if (!editInput)
            return;
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
    cancelEdit() {
        this.editingId = null;
        this.render();
    }
    reorderTodo(draggedId, targetId) {
        const draggedTodo = this.todos.find((t) => t.id === draggedId);
        const targetTodo = this.todos.find((t) => t.id === targetId);
        if (!draggedTodo || !targetTodo)
            return;
        // Prevent reordering between active and completed sections
        if (draggedTodo.completed !== targetTodo.completed)
            return;
        const draggedIndex = this.todos.findIndex((t) => t.id === draggedId);
        const targetIndex = this.todos.findIndex((t) => t.id === targetId);
        if (draggedIndex === -1 || targetIndex === -1)
            return;
        const [draggedItem] = this.todos.splice(draggedIndex, 1);
        this.todos.splice(targetIndex, 0, draggedItem);
        this.saveToLocalStorage();
        this.render();
    }
    setFilter(filter) {
        this.currentFilter = filter;
        querySelectorAll(".filter-btn").forEach((btn) => {
            btn.classList.remove("active");
            if (btn.dataset.filter === filter) {
                btn.classList.add("active");
            }
        });
        this.render();
    }
    clearCompleted() {
        this.todos = this.todos.filter((t) => !t.completed);
        this.saveToLocalStorage();
        this.render();
    }
    resetAll() {
        if (confirm("Are you sure you want to reset all todos? This will clear everything and load example items.")) {
            this.todos = [];
            this.loadExampleItems();
            this.render();
        }
    }
    getFilteredTodos() {
        switch (this.currentFilter) {
            case "active":
                return this.todos.filter((t) => !t.completed);
            case "completed":
                return this.todos.filter((t) => t.completed);
            default:
                return this.todos;
        }
    }
    render() {
        const filteredTodos = this.getFilteredTodos();
        renderTodoList(this.todos, filteredTodos, this.currentFilter, this.editingId, {
            onToggle: (id) => this.toggleTodo(id),
            onEdit: (id) => this.startEdit(id),
            onSave: (id) => this.saveEdit(id),
            onCancel: () => this.cancelEdit(),
            onDelete: (id) => this.deleteTodo(id),
            onReorder: (draggedId, targetId) => this.reorderTodo(draggedId, targetId),
        });
    }
    saveToLocalStorage() {
        saveTodos(this.todos);
    }
    loadFromLocalStorage() {
        const stored = loadTodos();
        if (stored) {
            this.todos = stored;
        }
        else {
            this.loadExampleItems();
        }
    }
    loadExampleItems() {
        this.todos = getExampleTodos();
        this.saveToLocalStorage();
    }
}
