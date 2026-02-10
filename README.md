# Todo App with LocalStorage

A single-page to-do web application built with HTML, CSS, and vanilla JavaScript. This app allows you to manage your tasks with full CRUD functionality, and all data is persisted in the browser's localStorage.

## Features

- ✅ **Add Tasks**: Create new to-do items with a simple input field
- ✏️ **Edit Tasks**: Use the edit button to modify existing tasks
- ✓ **Complete Tasks**: Mark tasks as complete/incomplete with a single click
- 🗑️ **Delete Tasks**: Remove individual tasks you no longer need
- 🔍 **Filter Tasks**: View All, Active, or Completed tasks
- 🧹 **Clear Completed**: Remove all completed tasks at once
- 💾 **LocalStorage Persistence**: Your tasks are automatically saved and persist across browser sessions
- 📝 **Example Items**: Pre-loaded example tasks on first visit
- 🔄 **Reset Button**: Clear all data and reload example items

## How to Use

1. Open `index.html` in your web browser
2. Type a task in the input field and click "Add" or press Enter
3. Click the checkbox to mark a task as complete
4. Click "Edit" to modify a task, then "Save" or "Cancel"
5. Click "Delete" to remove a task
6. Use the filter buttons (All/Active/Completed) to view different task lists
7. Click "Clear completed" to remove all completed tasks
8. Click "Reset All" to clear everything and start fresh with example items

## Technical Details

- **No dependencies**: Pure vanilla JavaScript, no frameworks or libraries
- **Responsive design**: Works on desktop and mobile devices
- **LocalStorage API**: Automatic data persistence
- **Clean UI**: Modern, intuitive interface with smooth interactions

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and responsive design
- `app.js` - Application logic and localStorage management