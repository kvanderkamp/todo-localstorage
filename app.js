// Todo App with localStorage
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
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
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed
        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompleted();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetAll();
        });
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        this.todos.push(todo);
        input.value = '';
        this.saveToLocalStorage();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    startEdit(id) {
        this.editingId = id;
        this.render();
        
        // Focus on edit input
        const editInput = document.querySelector(`[data-edit-id="${id}"]`);
        if (editInput) {
            editInput.focus();
            editInput.select();
        }
    }

    saveEdit(id) {
        const editInput = document.querySelector(`[data-edit-id="${id}"]`);
        const newText = editInput.value.trim();

        if (newText === '') {
            this.deleteTodo(id);
            return;
        }

        const todo = this.todos.find(t => t.id === id);
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

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveToLocalStorage();
        this.render();
    }

    resetAll() {
        if (confirm('Are you sure you want to reset all todos? This will clear everything and load example items.')) {
            localStorage.removeItem('todos');
            this.todos = [];
            this.loadExampleItems();
            this.render();
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        // Clear list
        todoList.innerHTML = '';

        // Render todos
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item${todo.completed ? ' completed' : ''}${this.editingId === todo.id ? ' editing' : ''}`;
            li.dataset.id = todo.id;

            li.innerHTML = `
                <div class="todo-checkbox"></div>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <input type="text" class="edit-input${this.editingId === todo.id ? ' active' : ''}" 
                       value="${this.escapeHtml(todo.text)}" 
                       data-edit-id="${todo.id}">
                <div class="todo-actions">
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Delete</button>
                    <button class="btn-save">Save</button>
                    <button class="btn-cancel">Cancel</button>
                </div>
            `;

            // Event listeners for this todo item
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('click', () => this.toggleTodo(todo.id));

            const deleteBtn = li.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            const editBtn = li.querySelector('.btn-edit');
            editBtn.addEventListener('click', () => this.startEdit(todo.id));

            const saveBtn = li.querySelector('.btn-save');
            saveBtn.addEventListener('click', () => this.saveEdit(todo.id));

            const cancelBtn = li.querySelector('.btn-cancel');
            cancelBtn.addEventListener('click', () => this.cancelEdit());

            const editInput = li.querySelector('.edit-input');
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveEdit(todo.id);
                }
            });
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.cancelEdit();
                }
            });

            todoList.appendChild(li);
        });

        // Update count
        const activeCount = this.todos.filter(t => !t.completed).length;
        const countText = activeCount === 1 ? '1 item left' : `${activeCount} items left`;
        document.getElementById('todoCount').textContent = countText;

        // Show/hide footer
        const footer = document.getElementById('footer');
        const todoListContainer = document.getElementById('todoListContainer');
        if (this.todos.length === 0) {
            footer.style.display = 'none';
            todoListContainer.style.display = 'none';
        } else {
            footer.style.display = 'flex';
            todoListContainer.style.display = 'block';
        }

        // Show/hide clear completed button
        const hasCompleted = this.todos.some(t => t.completed);
        const clearBtn = document.getElementById('clearCompleted');
        clearBtn.style.visibility = hasCompleted ? 'visible' : 'hidden';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('todos');
        if (stored) {
            try {
                this.todos = JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing todos from localStorage:', e);
                this.todos = [];
                this.loadExampleItems();
            }
        } else {
            // First time - load example items
            this.loadExampleItems();
        }
    }

    loadExampleItems() {
        const baseTime = Date.now();
        this.todos = [
            { id: baseTime * 1000 + 1, text: 'Complete the project documentation', completed: false },
            { id: baseTime * 1000 + 2, text: 'Review pull requests', completed: false },
            { id: baseTime * 1000 + 3, text: 'Buy groceries', completed: true },
            { id: baseTime * 1000 + 4, text: 'Schedule team meeting', completed: false }
        ];
        this.saveToLocalStorage();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
