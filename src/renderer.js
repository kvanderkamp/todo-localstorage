/**
 * UI rendering functions for the Todo app
 */
import { escapeHtml } from "./utils";
/**
 * Render the complete todo list
 */
export function renderTodoList(todos, filteredTodos, currentFilter, editingId, context) {
    const todoList = document.getElementById("todoList");
    if (!todoList)
        return;
    // Sort todos: active items first, completed items at bottom
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (a.completed === b.completed)
            return 0;
        return a.completed ? 1 : -1;
    });
    todoList.innerHTML = "";
    let dividerAdded = false;
    sortedTodos.forEach((todo) => {
        // Add divider before first completed item
        if (todo.completed && !dividerAdded && currentFilter === "all") {
            const divider = document.createElement("li");
            divider.className = "todo-divider";
            divider.innerHTML = "<span>Completed</span>";
            todoList.appendChild(divider);
            dividerAdded = true;
        }
        const li = createTodoItem(todo, editingId, context);
        todoList.appendChild(li);
    });
    updateFooterState(todos);
}
/**
 * Create a single todo item element
 */
function createTodoItem(todo, editingId, context) {
    const li = document.createElement("li");
    li.className = `todo-item${todo.completed ? " completed" : ""}${editingId === todo.id ? " editing" : ""}`;
    li.dataset.id = todo.id.toString();
    li.draggable = true;
    li.innerHTML = `
    <div class="todo-checkbox"></div>
    <span class="todo-text">${escapeHtml(todo.text)}</span>
    <input type="text" class="edit-input${editingId === todo.id ? " active" : ""}" 
           value="${escapeHtml(todo.text)}" 
           data-edit-id="${todo.id}">
    <div class="todo-actions">
      <button class="btn-edit">Edit</button>
      <button class="btn-delete">Delete</button>
      <button class="btn-save">Save</button>
      <button class="btn-cancel">Cancel</button>
    </div>
  `;
    attachTodoItemListeners(li, todo, editingId, context);
    return li;
}
/**
 * Attach event listeners to a todo item
 */
function attachTodoItemListeners(li, todo, editingId, context) {
    // Checkbox
    const checkbox = li.querySelector(".todo-checkbox");
    checkbox?.addEventListener("click", () => context.onToggle(todo.id));
    // Todo text
    const todoText = li.querySelector(".todo-text");
    if (!todo.completed && todoText) {
        todoText.addEventListener("dblclick", () => context.onEdit(todo.id));
    }
    // Buttons
    const deleteBtn = li.querySelector(".btn-delete");
    deleteBtn?.addEventListener("click", () => context.onDelete(todo.id));
    const editBtn = li.querySelector(".btn-edit");
    editBtn?.addEventListener("click", () => context.onEdit(todo.id));
    const saveBtn = li.querySelector(".btn-save");
    saveBtn?.addEventListener("click", () => context.onSave(todo.id));
    const cancelBtn = li.querySelector(".btn-cancel");
    cancelBtn?.addEventListener("click", () => context.onCancel());
    // Edit input
    const editInput = li.querySelector(".edit-input");
    editInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            context.onSave(todo.id);
        }
    });
    editInput?.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            context.onCancel();
        }
    });
    editInput?.addEventListener("blur", () => {
        setTimeout(() => {
            if (editingId === todo.id) {
                context.onSave(todo.id);
            }
        }, 150);
    });
    // Drag and drop
    attachDragDropListeners(li, context);
}
/**
 * Attach drag and drop listeners to a todo item
 */
function attachDragDropListeners(li, context) {
    li.addEventListener("dragstart", (e) => {
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/html", li.innerHTML);
        }
        li.classList.add("dragging");
    });
    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        document.querySelectorAll(".todo-item").forEach((item) => {
            item.classList.remove("drag-over");
        });
    });
    li.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "move";
        }
        return false;
    });
    li.addEventListener("dragenter", () => {
        if (li.classList.contains("dragging"))
            return;
        li.classList.add("drag-over");
    });
    li.addEventListener("dragleave", () => {
        li.classList.remove("drag-over");
    });
    li.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const draggedItem = document.querySelector(".dragging");
        if (draggedItem && draggedItem !== li) {
            const draggedId = parseInt(draggedItem.dataset.id || "0");
            const targetId = parseInt(li.dataset.id || "0");
            context.onReorder(draggedId, targetId);
        }
        li.classList.remove("drag-over");
        return false;
    });
}
/**
 * Update the footer state (count, buttons visibility)
 */
function updateFooterState(todos) {
    // Update count
    const activeCount = todos.filter((t) => !t.completed).length;
    const countText = activeCount === 1 ? "1 item left" : `${activeCount} items left`;
    const todoCount = document.getElementById("todoCount");
    if (todoCount) {
        todoCount.textContent = countText;
    }
    // Show/hide footer and container
    const footer = document.getElementById("footer");
    const todoListContainer = document.getElementById("todoListContainer");
    if (todos.length === 0) {
        if (footer)
            footer.style.display = "none";
        if (todoListContainer)
            todoListContainer.style.display = "none";
    }
    else {
        if (footer)
            footer.style.display = "flex";
        if (todoListContainer)
            todoListContainer.style.display = "block";
    }
    // Show/hide clear completed button
    const hasCompleted = todos.some((t) => t.completed);
    const clearBtn = document.getElementById("clearCompleted");
    if (clearBtn) {
        clearBtn.style.visibility = hasCompleted ? "visible" : "hidden";
    }
}
