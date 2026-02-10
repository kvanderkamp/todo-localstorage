# To-Do List Application

A simple, elegant to-do list web application built with vanilla HTML, CSS, and JavaScript. Tasks are persisted using browser localStorage.

## Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Edit task text (double-click on task or use Edit button)
- ✅ Delete tasks
- ✅ Filter tasks: All / Active / Completed
- ✅ Clear all completed tasks
- ✅ Reset button to clear all data and start fresh
- ✅ Persistent storage using localStorage
- ✅ Responsive design for mobile and desktop
- ✅ Accessible with proper ARIA labels

## How to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/kvanderkamp/todo-localstorage.git
   cd todo-localstorage
   ```

2. Open `index.html` in your web browser:
   - **Option 1**: Double-click the `index.html` file
   - **Option 2**: Right-click and select "Open with" your preferred browser
   - **Option 3**: Use a local server (optional):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (if you have http-server installed)
     npx http-server
     ```
     Then navigate to `http://localhost:8000`

3. The app will automatically load with some example tasks on first run.

## Usage

### Adding Tasks
- Type your task in the input field at the top
- Press Enter or click the "Add" button

### Managing Tasks
- **Complete/Uncomplete**: Click the checkbox next to a task
- **Edit**: Double-click on the task text or click the "Edit" button
- **Delete**: Click the "Delete" button

### Filtering
- **All**: Show all tasks
- **Active**: Show only incomplete tasks
- **Completed**: Show only completed tasks

### Clearing Data
- **Clear Completed**: Remove all completed tasks
- **Reset**: Clear all data from localStorage and reload the app with example tasks

## Technical Details

- **Storage Key**: `todo_app_v1` (used for localStorage)
- **No Build Required**: Pure HTML/CSS/JS - works directly in the browser
- **Browser Compatibility**: Works in all modern browsers with localStorage support

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `app.js` - Application logic and localStorage integration
- `README.md` - This file

## Data Persistence

Tasks are automatically saved to your browser's localStorage. This means:
- Your tasks persist across page refreshes
- Tasks are specific to this browser and domain
- Clearing browser data will remove your tasks
- Use the Reset button to manually clear all stored data