// Constants
const STORAGE_KEY = 'todo_app_v1';

// DOM Elements
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const resetBtn = document.getElementById('reset-btn');
const taskCounter = document.getElementById('task-counter');

// State
let tasks = [];
let currentFilter = 'all';

// Initialize app
function init() {
    loadTasks();
    renderTasks();
    updateCounter();
    attachEventListeners();
}

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // Seed with example tasks on first run
        tasks = [
            { id: generateId(), text: 'Welcome to your To-Do List!', completed: false },
            { id: generateId(), text: 'Double-click on a task to edit it', completed: false },
            { id: generateId(), text: 'Mark tasks as complete by checking the box', completed: true },
            { id: generateId(), text: 'Use filters to view specific tasks', completed: false }
        ];
        saveTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add new task
function addTask() {
    const text = newTaskInput.value.trim();
    
    if (text === '') {
        newTaskInput.focus();
        return;
    }
    
    const newTask = {
        id: generateId(),
        text: text,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateCounter();
    
    newTaskInput.value = '';
    newTaskInput.focus();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateCounter();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateCounter();
}

// Edit task - start editing
function startEditTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const textElement = taskElement.querySelector('.task-text');
    const actionsElement = taskElement.querySelector('.task-actions');
    const currentText = tasks.find(t => t.id === id).text;
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = currentText;
    
    // Create save and cancel buttons
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.setAttribute('aria-label', 'Save changes');
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.setAttribute('aria-label', 'Cancel editing');
    
    // Replace text with input
    textElement.replaceWith(input);
    
    // Replace actions with save/cancel buttons
    actionsElement.innerHTML = '';
    actionsElement.appendChild(saveBtn);
    actionsElement.appendChild(cancelBtn);
    
    input.focus();
    input.select();
    
    // Save on Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit(id, input.value);
        }
    });
    
    // Save on button click
    saveBtn.addEventListener('click', () => saveEdit(id, input.value));
    
    // Cancel on button click or Escape key
    cancelBtn.addEventListener('click', () => cancelEdit());
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cancelEdit();
        }
    });
}

// Save edited task
function saveEdit(id, newText) {
    const trimmedText = newText.trim();
    
    if (trimmedText === '') {
        cancelEdit();
        return;
    }
    
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.text = trimmedText;
        saveTasks();
        renderTasks();
    }
}

// Cancel editing
function cancelEdit() {
    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    updateCounter();
}

// Reset app
function resetApp() {
    if (confirm('Are you sure you want to reset the app? This will clear all tasks and reload the page.')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// Filter tasks
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderTasks();
}

// Get filtered tasks
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// Render tasks to the DOM
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        // Task text
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        textSpan.addEventListener('dblclick', () => startEditTask(task.id));
        
        // Actions container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.setAttribute('aria-label', `Edit task "${task.text}"`);
        editBtn.addEventListener('click', () => startEditTask(task.id));
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(actionsDiv);
        
        taskList.appendChild(li);
    });
}

// Update task counter
function updateCounter() {
    const count = tasks.length;
    const activeCount = tasks.filter(t => !t.completed).length;
    taskCounter.textContent = `${count} task${count !== 1 ? 's' : ''} (${activeCount} active)`;
}

// Attach event listeners
function attachEventListeners() {
    // Add task
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
    
    // Clear completed
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Reset
    resetBtn.addEventListener('click', resetApp);
}

// Start the app
init();
