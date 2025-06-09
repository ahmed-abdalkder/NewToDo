 
 
import React from "react";
// useSortable is a hook from @dnd-kit/sortable for drag-and-drop sortable lists
import { useSortable } from "@dnd-kit/sortable";
// CSS utility helps convert drag transform info into CSS style strings
import { CSS } from "@dnd-kit/utilities";
// useTranslation hook from react-i18next for multi-language support
import { useTranslation } from 'react-i18next';
// Import the Task type from your TodoContext to type-check props
import type { Task } from "../../Context/Todo/TodoContext";

/**
 * SortableTask component represents a single task item
 * inside a sortable list. It supports editing, deleting,
 * completing, and drag-and-drop reordering.
 */
type SortableTaskProps = {
  task: Task; // The task data object
  index: number; // Position index of the task in the list
  isEditing: boolean; // Is this task currently in editing mode
  isSelected: boolean; // Is this task currently selected (highlighted)
  editedText: string; // Current text in the edit input
  setEditedText: (text: string) => void; // Function to update editedText state
  setEditingTaskId: (id: string | null) => void; // Function to set which task is editing
  updateTask: (id: string, taskId: string, text: string, completed: boolean) => Promise<void>; // Async function to update task info
  deleteTask: (id: string, taskId: string) => Promise<void>; // Async function to delete the task
  id: string; // The ID of the todo list or parent context (probably)
  setSelectedTaskIndex: (index: number | null) => void; // Set the selected task index for UI focus
};

const SortableTask = ({
  task,
  index,
  isEditing,
  isSelected,
  editedText,
  setEditedText,
  setEditingTaskId,
  updateTask,
  deleteTask,
  id,
  setSelectedTaskIndex,
}: SortableTaskProps) => {
  // Initialize drag-and-drop sortable behavior on this task using its unique id
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  // Translation hook to support i18n text
  const { t } = useTranslation();

  // Build inline style object for transform and transition for smooth dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Arrays of Tailwind gradient classes for task background color cycling by index
  const gradients = [
    "from-rose-100 to-pink-100",
    "from-blue-100 to-cyan-100", 
    "from-green-100 to-emerald-100",
    "from-yellow-100 to-orange-100",
    "from-purple-100 to-violet-100",
    "from-indigo-100 to-blue-100",
    "from-teal-100 to-green-100",
  ];

  // Border accent colors matching gradients for task card outline
  const accentColors = [
    "border-rose-200 hover:border-rose-300",
    "border-blue-200 hover:border-blue-300",
    "border-green-200 hover:border-green-300", 
    "border-yellow-200 hover:border-yellow-300",
    "border-purple-200 hover:border-purple-300",
    "border-indigo-200 hover:border-indigo-300",
    "border-teal-200 hover:border-teal-300",
  ];

  // Icon colors matching the theme for drag handle icon
  const iconColors = [
    "text-rose-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500", 
    "text-purple-500",
    "text-indigo-500",
    "text-teal-500",
  ];

  // Choose color theme based on task index (cycles through arrays)
  const currentGradient = gradients[index % gradients.length];
  const currentAccent = accentColors[index % accentColors.length];
  const currentIcon = iconColors[index % iconColors.length];

  return (
    <div
      ref={setNodeRef} // Ref to connect this div to drag-and-drop system
      style={style}    // Apply drag transform styles
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTaskIndex(index); // Mark this task as selected on click
      }}
      // Tailwind classes for the card, dynamically adding classes for state
      className={`
        group relative bg-gradient-to-br ${currentGradient} 
        border-2 ${currentAccent} 
        rounded-3xl shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:-translate-y-1 
        ${isSelected ? "ring-4 ring-blue-400 ring-opacity-50 scale-[1.02]" : ""}
        ${task.completed ? "opacity-75" : ""}
        backdrop-blur-sm
        overflow-hidden
      `}
    >
      {/* Subtle background pattern using radial gradient */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative p-6">
        {/* Task Content Section */}
        <div className="mb-6">
          {/* Task Text */}
          <div className="mb-4">
            {/* If editing and not completed, show input; else show text */}
            {isEditing && !task.completed ? (
              <input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full px-4 py-3 text-lg font-medium text-gray-800 bg-white/80 border-2 border-white/50 rounded-2xl focus:border-blue-400 focus:bg-white focus:outline-none transition-all duration-300 backdrop-blur-sm"
                autoFocus
                onClick={(e) => e.stopPropagation()} // Prevent clicks bubbling up to parent
              />
            ) : (
              <p className={`
                text-lg md:text-xl font-semibold leading-relaxed
                ${task.completed 
                  ? "line-through text-gray-500" 
                  : "text-gray-800"
                }
              `}>
                {task.text}
              </p>
            )}
          </div>

          {/* Task Date and Time Display if available */}
          {task.date && (
            <div className="flex items-center gap-3 text-gray-600 mb-4">
              {/* Date */}
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
                <i className="far fa-calendar-alt mr-2 text-gray-500"></i>
                <span className="text-sm md:text-base font-medium">
                  {new Date(task.date).toLocaleDateString()}
                </span>
              </div>
              
              {/* Time */}
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
                <i className="far fa-clock mr-2 text-gray-500"></i>
                <span className="text-sm md:text-base font-medium">
                  {new Date(task.date).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-4 md:gap-6">
          {/* Drag Handle - to drag reorder task */}
          <div
            {...attributes}  // Drag-and-drop attributes (aria, draggable etc)
            {...listeners}   // Event listeners for drag interaction
            className={`
              flex-shrink-0 w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm 
              flex items-center justify-center cursor-grab active:cursor-grabbing
              hover:bg-white/90 transition-all duration-200 group-hover:scale-110
              shadow-md hover:shadow-lg
            `}
            onClick={(e) => e.stopPropagation()} // Prevent click bubbling
            title={t('dragTask', 'Drag task')}  // Tooltip text translated
          >
            <i className={`fas fa-grip-vertical ${currentIcon} text-xl`}></i>
          </div>

          <div className="flex-1"></div> {/* Spacer to push buttons right */}

          {/* Action Buttons Section */}
          <div className="flex-shrink-0 flex flex-col md:flex-row gap-2 md:gap-3">
            {/* Edit or Save Button */}
            {isEditing && !task.completed ? (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await updateTask(id, task._id, editedText, task.completed);
                  setEditingTaskId(null); // Stop editing after save
                }}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                title={t('done', 'Save changes')}
              >
                <i className="fas fa-check text-lg"></i>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTaskId(task._id); // Start editing this task
                  setEditedText(task.text);   // Set input text to current text
                }}
                className="w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                title={t('editTask', 'Edit task')}
              >
                <i className="fas fa-edit text-lg"></i>
              </button>
            )}

            {/* Complete/Incomplete Toggle Button */}
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await updateTask(id, task._id, task.text, !task.completed);
              }}
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center 
                transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl
                ${task.completed 
                  ? "bg-gray-400 hover:bg-gray-500 text-white" 
                  : "bg-green-500 hover:bg-green-600 text-white"
                }
              `}
              title={task.completed ? t('markIncomplete', 'Mark as incomplete') : t('markComplete', 'Mark as complete')}
            >
              <i className={`fas ${task.completed ? 'fa-undo' : 'fa-check-circle'} text-lg`}></i>
            </button>

            {/* Delete Button */}
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this task?')) {
                  await deleteTask(id, task._id);
                }
              }}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
              title={t('deleteTask', 'Delete task')}
            >
              <i className="fas fa-trash-alt text-lg"></i>
            </button>
          </div>
        </div>

        {/* Completed status icon in top-right corner */}
        {task.completed && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              <i className="fas fa-check text-sm"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortableTask;
