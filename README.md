# Todo App with LocalStorage

A single-page to-do web application built with **TypeScript**, HTML, and CSS. This app allows you to manage your tasks with full CRUD functionality, and all data is persisted in the browser's localStorage.

## Features

- ✅ **Add Tasks**: Create new to-do items with a simple input field
- ✏️ **Edit Tasks**: Double-click tasks or use the edit button to modify them
- ✓ **Complete Tasks**: Mark tasks as complete/incomplete with a single click
- 🗑️ **Delete Tasks**: Remove individual tasks you no longer need
- 🔍 **Filter Tasks**: View All, Active, or Completed tasks
- 🧹 **Clear Completed**: Remove all completed tasks at once
- 🎨 **Dark Theme**: Modern dark UI with enhanced visual effects
- 🖱️ **Drag & Drop**: Reorder tasks by dragging them
- 📋 **Auto-Sorting**: Completed items automatically move to the bottom
- 💾 **LocalStorage Persistence**: Your tasks are automatically saved and persist across browser sessions
- 📝 **Example Items**: Pre-loaded example tasks on first visit
- 🔄 **Reset Button**: Clear all data and reload example items
- 🔷 **TypeScript**: Full type safety and modern development experience

## Setup & Installation

### Prerequisites

- Node.js and npm installed on your system

### Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Build the project**

   ```bash
   npm run build
   ```

3. **Development mode** (auto-recompile on changes)

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Open `index.html` in your web browser
   - Or use a local development server

## How to Use

1. Type a task in the input field and click "Add" or press Enter
2. **Double-click** a task to edit it inline
3. Click the checkbox to mark a task as complete
4. **Drag and drop** tasks to reorder them within their section
5. Use the filter buttons (All/Active/Completed) to view different task lists
6. Click "Clear completed" to remove all completed tasks
7. Click "Reset All" to clear everything and start fresh with example items

## Technical Details

- **TypeScript**: Fully typed with interfaces and type safety
- **No frameworks**: Pure vanilla TypeScript, no frameworks or libraries
- **Responsive design**: Works on desktop and mobile devices
- **LocalStorage API**: Automatic data persistence
- **Dark Theme**: Modern UI with glowing effects and smooth animations
- **Clean UI**: Intuitive interface with smooth interactions

## Project Structure

```
src/
├── main.ts          # Entry point
├── types.ts         # Type definitions
├── todo-app.ts      # Main TodoApp class
├── storage.ts       # localStorage operations
├── renderer.ts      # UI rendering functions
└── utils.ts         # Utility functions

dist/
└── app.js           # Compiled and bundled JavaScript

index.html          # HTML template
style.css           # Styling
tsconfig.json       # TypeScript config
package.json        # Project dependencies
```

## Development

The project uses TypeScript with strict mode enabled for maximum type safety. All methods are properly typed, and the `Todo` interface ensures data consistency throughout the application.

### Module Architecture

The application is organized into focused modules for better maintainability:

- **types.ts** - Shared type definitions (`Todo`, `FilterType`)
- **storage.ts** - All localStorage operations (save, load, clear)
- **utils.ts** - Reusable utility functions (DOM helpers, HTML escaping)
- **renderer.ts** - All UI rendering logic and event binding
- **todo-app.ts** - Core application logic and state management
- **main.ts** - Application entry point

This modular design makes the code:

- **More testable** - Each module has a single responsibility
- **Easier to maintain** - Changes are isolated to relevant modules
- **Better organized** - Clear separation of concerns
- **Reusable** - Utils and storage can be used in other projects

### Type Definitions

```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";
```
