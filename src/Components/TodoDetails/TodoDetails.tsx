 // Imports section:
// Import React and hooks needed for the component.
// Import TodoContext and its types for task management and context typing.
// Import useParams to get the dynamic URL parameter (id).
// Import Yup and useFormik for form validation and handling.
// Import custom keyboard shortcut hooks for todo keyboard controls.
// Import drag and drop utilities from @dnd-kit for sortable list features.
// Import DatePicker for date and time selection input.
// Import translation hook for i18n support.

import React from "react";
import { useContext, useEffect, useState } from "react";
import {
  TodoContext,
  type Task,
  type TodoContextType,
} from "../../Context/Todo/TodoContext";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTodoKeyboardShortcuts } from "../KeyShortcuts/KeyShortcuts";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "../SortableTasks/SortableTasks";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import VantaBackground from "../VantaBackground/VantaBackground";

// Main component function: TodoDetails
// Handles display, addition, editing, deletion, and drag-and-drop sorting of tasks for a specific todo list identified by id from URL params.

const TodoDetails = () => {
  // Initialize translation hook for multilingual support
  const { t } = useTranslation();

  // Get the 'id' param from the route, defaults to empty string if undefined
  const { id = "" } = useParams();

  // Local state variables:
  // selectedTaskIndex: index of the currently selected task in the list.
  // editingTaskId: id of the task currently in editing mode.
  // editedText: holds the text input while editing a task.
  // tasks: array of tasks currently shown in the UI.
  // activeTask: task currently being dragged.
  // selectedDate: stores the date selected for a new task.
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get context methods and values for task management from TodoContext
  const {
    addTask,
    updateTask,
    deleteTask,
    getTasks,
    allTasks,
    completedTasksPercentages,
  } = useContext<TodoContextType>(TodoContext);

  // Calculate completed task percentage for current todo list id
  const percentage = id ? completedTasksPercentages[id] : 0;

  // Formik form setup for adding a new task:
  // initialValues for text and date,
  // Yup validation schema requiring a non-empty text and a valid date,
  // onSubmit calls addTask and resets the form and date selection.
  const formik = useFormik({
    initialValues: { text: "", date: null },
    validationSchema: Yup.object({
      text: Yup.string().required(t("pleaseEnterATask")),
      date: Yup.date()
        .required(t("dateRequired"))
        .typeError(t("invalidDate")),
    }),
    onSubmit: async (values) => {
      await addTask(id, values.text, values.date || undefined);
      formik.resetForm();
      setSelectedDate(null);
    },
  });

  // Effect to load tasks for the current todo list when the id changes
  useEffect(() => {
    if (id) getTasks(id);
  }, [id]);

  // Update local tasks state whenever the allTasks from context changes
  useEffect(() => {
    setTasks(allTasks);
  }, [allTasks]);

  // Register custom keyboard shortcuts for tasks (edit, delete, navigate, etc)
  useTodoKeyboardShortcuts({
    allTasks: tasks,
    formik,
    id,
    updateTask,
    deleteTask,
    setEditingTaskId,
    setEditedText,
    selectedTaskIndex,
    setSelectedTaskIndex,
  });

  // Setup drag-and-drop sensors for pointer input
  const sensors = useSensors(useSensor(PointerSensor));

  // Handle drag end event to reorder the task list array and reset activeTask
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t._id === active.id);
    const newIndex = tasks.findIndex((t) => t._id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    setTasks(reordered);
    setActiveTask(null);
  };

  // Component JSX rendering:
  return (
    <div className="mb-10" onClick={() => setSelectedTaskIndex(null)}>
      {/* Task input form */}
      <form onSubmit={formik.handleSubmit} className="mt-6">
        <div className="w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          {/* Task text input */}
          <input
            type="text"
            name="text"
            value={formik.values.text}
            onChange={formik.handleChange}
            className="border border-gray-300 text-gray-900 text-sm rounded-2xl sm:rounded-l-2xl block w-full p-4 sm:p-5 focus:border focus:border-sky-400 focus:outline-0"
            placeholder={t("writeATask")}
            onClick={(e) => e.stopPropagation()} // Prevent parent div click closing selection
          />

          {/* Date picker and submit button container */}
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative w-full">
              <i className="fa-regular fa-calendar-days absolute top-3 left-3 text-gray-400 text-xl z-10 pointer-events-none"></i>
              {/* Date picker input */}
              <DatePicker
                selected={formik.values.date ? new Date(formik.values.date) : null}
                onChange={(date: Date | null) => formik.setFieldValue("date", date)}
                placeholderText={t("selectDueDateAndTime")}
                showTimeSelect
                dateFormat="Pp"
                className="pl-10 pr-3 py-3 rounded-2xl border border-gray-300 w-full text-sm"
              />
              {/* Date validation error */}
              {formik.touched.date && formik.errors.date && (
                <div className="text-red-600 text-sm">{formik.errors.date}</div>
              )}
            </div>

            {/* Submit button */}
            <button type="submit" className="cursor-pointer">
              <i className="fa-solid fa-square-plus text-sky-400 text-4xl sm:text-7xl"></i>
            </button>
          </div>
        </div>

        {/* Text input validation error */}
        {formik.touched.text && formik.errors.text && (
          <div className="mb-4 text-sm text-red-800 rounded-lg" role="alert">
            {formik.errors.text}
          </div>
        )}
      </form>

      {/* Header showing task list title and completion progress bar */}
      <div className="my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 px-4 gap-4 bg-gray-100 shadow-lg rounded-xl">
        <p className="text-2xl sm:text-4xl font-semibold">
          <i className="fa-solid fa-list-check text-sky-400 mr-3"></i> {t("allTasks")}
        </p>

        {/* Progress bar for completed tasks */}
        <div className="w-full sm:w-1/3 bg-gray-300 rounded-full h-5">
          <div
            className={`${
              percentage ? "bg-sky-400" : ""
            } text-xs font-medium text-white text-center h-5 leading-5 rounded-full`}
            style={{ width: `${percentage}%` }}
          >
            {percentage}%
          </div>
        </div>
      </div>

      {/* Drag and drop context for sortable tasks */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          // Set the active task being dragged
          const found = tasks.find((t) => t._id === active.id);
          if (found) setActiveTask(found);
        }}
      >
        {/* Context for sortable list, with vertical strategy */}
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {/* Render each task as a sortable item */}
          {tasks.map((task, index) => (
            <SortableTask
              key={task._id}
              task={task}
              index={index}
              isEditing={editingTaskId === task._id}
              isSelected={selectedTaskIndex === index}
              editedText={editedText}
              setEditedText={setEditedText}
              setEditingTaskId={setEditingTaskId}
              updateTask={updateTask}
              deleteTask={deleteTask}
              id={id}
              setSelectedTaskIndex={setSelectedTaskIndex}
            />
          ))}
        </SortableContext>
         {tasks.length === 0 && (
      <div className="h-[300px] w-full flex justify-center items-center col-span-full">
      <VantaBackground effect="net" />
    </div>
         )}
        {/* Overlay displayed when dragging a task */}
        <DragOverlay>
          {activeTask && (
            <div className="flex items-center justify-between bg-white shadow-2xl px-6 py-4 mb-4 rounded-3xl text-lg sm:text-xl scale-105 ring-2 ring-sky-400">
              <p>
                <i className="fa-solid fa-sort mr-2 text-sky-500"></i> {activeTask.text}
              </p>
              {activeTask.date && (
                <span className="text-sm text-gray-500">
                  {new Date(activeTask.date).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TodoDetails;
