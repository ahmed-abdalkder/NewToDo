// This custom React hook adds global keyboard shortcuts for managing to-do tasks.
// It allows keyboard navigation through tasks, marking tasks as completed, editing, and deleting them.
// It also supports submitting the form via Ctrl + M.

// Importing `useEffect` to handle side effects like adding/removing event listeners
import { useEffect } from "react";

// Importing the Task type from context to ensure type safety
import type { Task } from "../../Context/Todo/TodoContext";

// Defining the expected props the hook will receive
type UseTodoKeyboardShortcutsProps = {
  allTasks: Task[]; // The list of all tasks in the current todo
  formik: any; // Formik instance used for form submission (e.g., creating a new task)
  id: string | undefined; // The ID of the todo list (used in update and delete)
  updateTask: (todoId: string, taskId: string, text: string, completed: boolean) => Promise<void>; // Function to update a task
  deleteTask: (todoId: string, taskId: string) => Promise<void>; // Function to delete a task
  setEditingTaskId: React.Dispatch<React.SetStateAction<string | null>>; // Function to set the task currently being edited
  setEditedText: React.Dispatch<React.SetStateAction<string>>; // Function to set the text for editing a task
  selectedTaskIndex: number | null; // The index of the currently selected task
  setSelectedTaskIndex: React.Dispatch<React.SetStateAction<number | null>>; // Function to change the selected task index
};

// The custom hook implementation
export const useTodoKeyboardShortcuts = ({
  allTasks,
  formik,
  id,
  updateTask,
  deleteTask,
  setEditingTaskId,
  setEditedText,
  selectedTaskIndex,
  setSelectedTaskIndex,
}: UseTodoKeyboardShortcutsProps) => {

  useEffect(() => {
    // This function will be triggered when any key is pressed
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;

      // Check if the currently focused element is an input or textarea (i.e., the user is typing)
      const isTyping = activeElement?.tagName === "INPUT" || activeElement?.tagName === "TEXTAREA";

      // Ctrl + M => Trigger formik form submission (e.g., add new task)
      if (e.ctrlKey) {
        if (e.key === "M" || e.key === "m") {
          e.preventDefault(); // Prevent default browser behavior
          formik.handleSubmit(); // Submit the form
          return; // Exit early to avoid other logic
        }
      }

      // If the user is typing, ignore all other shortcuts
      if (isTyping) return;

      // ArrowDown => Move selection to next task
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedTaskIndex((prev) => {
          if (allTasks.length === 0) return null; // No tasks available

          if (prev === null || prev >= allTasks.length - 1) {
            return 0; // If no selection or last item selected, loop to the first
          }

          return prev + 1; // Move to the next task
        });
      }

      // ArrowUp => Move selection to previous task
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedTaskIndex((prev) => {
          if (allTasks.length === 0) return null; // No tasks available

          if (prev === null || prev <= 0) {
            return allTasks.length - 1; // If no selection or first item, loop to the last
          }

          return prev - 1; // Move to the previous task
        });
      }

      // Space => Toggle completion status of the selected task
      if (e.key === " " && selectedTaskIndex !== null) {
        e.preventDefault();
        const task = allTasks[selectedTaskIndex];
        if (id) {
          updateTask(id, task._id, task.text, !task.completed); // Toggle completion
        }
      }

      // Enter or 'e' => Start editing the selected task (only if it's not completed)
      if ((e.key === "e" || e.key === "Enter") && selectedTaskIndex !== null) {
        e.preventDefault();
        const task = allTasks[selectedTaskIndex];
        if (!task.completed) {
          setEditingTaskId(task._id); // Mark this task as being edited
          setEditedText(task.text); // Set its text in editing state
        }
      }

      // Delete => Delete the selected task
      if ((e.key === "Delete") && selectedTaskIndex !== null) {
        e.preventDefault();
        const task = allTasks[selectedTaskIndex];
        if (id) {
          deleteTask(id, task._id); // Remove the task
        }
      }
    };

    // Attach the keydown event to the window when the component mounts
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    // Cleanup function to remove the listener when the component unmounts or dependencies change
    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [
    allTasks,
    selectedTaskIndex,
    formik,
    id,
    updateTask,
    deleteTask,
    setEditingTaskId,
    setEditedText,
    setSelectedTaskIndex,
  ]);
};

