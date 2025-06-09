


/**
 * HomeTodoCard Component
 * 
 * This component renders a single Todo card displayed on the home page.
 * It shows the todo's title, progress percentage, and an image.
 * It also provides delete functionality with a confirmation step.
 * The card is styled dynamically with gradient colors based on the colorIndex.
 */
 import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { TodoContext } from "../../Context/Todo/TodoContext";
import { useTranslation } from 'react-i18next';
 

// Color gradients for card accents (used for borders and highlights)
const modernColors = [
  "from-rose-400 to-pink-500",
  "from-blue-400 to-cyan-500", 
  "from-green-400 to-emerald-500",
  "from-purple-400 to-indigo-500",
  "from-yellow-400 to-orange-500",
  "from-indigo-400 to-purple-500",
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-blue-500"
];

// Background gradients for the card container
const cardBackgrounds = [
  "bg-gradient-to-br from-rose-50 to-pink-100",
  "bg-gradient-to-br from-blue-50 to-cyan-100",
  "bg-gradient-to-br from-green-50 to-emerald-100", 
  "bg-gradient-to-br from-purple-50 to-indigo-100",
  "bg-gradient-to-br from-yellow-50 to-orange-100",
  "bg-gradient-to-br from-indigo-50 to-purple-100",
  "bg-gradient-to-br from-pink-50 to-rose-100",
  "bg-gradient-to-br from-cyan-50 to-blue-100"
];

// Define the props type for the HomeTodoCard component
type TodoCardProps = {
  id: string;
  title: string;
  colorIndex: number;
  imageSrc: string;
  removeTodo: (id: string) => void;
};


const HomeTodoCard = ({ title, imageSrc, colorIndex, id, removeTodo }: TodoCardProps) => {
  // Get tasks and completion percentages from the TodoContext
  const { completedTasksPercentages, getTasks } = useContext(TodoContext);

  // Local state to handle deletion animation and confirmation display
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate the completion percentage for this todo using its id
  const percentage = id ? completedTasksPercentages[id] : 0;

  // Translation hook for multi-language support
  const { t } = useTranslation();

  // Determine gradient and background colors based on colorIndex, looping through arrays
  const gradientColor = modernColors[colorIndex % modernColors.length];
  const bgColor = cardBackgrounds[colorIndex % cardBackgrounds.length];

  // Fetch tasks for this todo when component mounts or id changes
  useEffect(() => {
    getTasks(id);
  }, [id]);

  // Handle the delete button click, call the removeTodo prop function
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeTodo(id);
    } catch (error) {
      setIsDeleting(false);  // Reset deleting state if an error occurs
    }
  };

return (
  // Main card container with styling and hover effects
  <div className={`group relative ${bgColor} rounded-2xl shadow-lg hover:shadow-xl border border-white/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
    
    {/* Link to the todo details page */}
    <Link to={`/tododetails/${id}`} className="block p-6">
      
      {/* Header section with image and title */}
      <div className="flex items-start gap-4 mb-6">
        
        {/* Todo image with fallback on error */}
        <div className="relative">
          <img 
            src={imageSrc} 
            alt="todo" 
            className="w-14 h-14 rounded-xl object-cover shadow-md ring-2 ring-white/50"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,...'; // Fallback image in case of load failure
            }}
          />
          {/* Color badge overlay on image */}
          <div className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r ${gradientColor} rounded-full flex items-center justify-center shadow-lg`}>
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Title and progress text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-slate-900 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {/* Display "Completed" if 100%, else show percentage */}
            {percentage === 100 ? t("card.completed") : `${percentage}% ${t("card.complete")}`}
          </p>
        </div>
      </div>

      {/* Progress bar section */}
      <div className="space-y-3">
        {/* Label and percentage number */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-medium">{t("card.progress")}</span>
          <span className={`font-bold ${percentage === 100 ? 'text-green-600' : 'text-slate-700'}`}>
            {percentage}%
          </span>
        </div>
        
        {/* Progress bar background */}
        <div className="relative">
          <div className="w-full bg-white/60 rounded-full h-3 shadow-inner">
            {/* Progress bar fill width controlled by percentage */}
            <div
              className={`h-3 rounded-full transition-all duration-500 ease-out shadow-sm ${percentage > 0 ? `bg-gradient-to-r ${gradientColor}` : ''}`}
              style={{ width: `${percentage}%` }}
            >
              {/* Pulsing indicator at the end of progress bar if progress > 0 */}
              {percentage > 0 && (
                <div className="absolute right-0 top-0 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status badge showing completion state */}
      <div className="mt-4 flex items-center gap-2">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          percentage === 100 
            ? 'bg-green-100 text-green-700' 
            : percentage > 0 
            ? 'bg-blue-100 text-blue-700'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {/* Different icon and text depending on progress */}
          {percentage === 100 ? (
            <>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {t("card.status.complete")}
            </>
          ) : percentage > 0 ? (
            <>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
               
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11v4l3 3-1 1-4-4V7h2z"
                  clipRule="evenodd"
                />
              </svg>
              {t("card.status.inProgress")}
            </>
          ) : (
            <>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {t("card.status.notStarted")}
            </>
          )}
        </div>
      </div>
    </Link>

    {/* Delete button and confirmation overlay */}
    <div className="absolute top-4 end-4">
      {showDeleteConfirm ? (
        // Confirmation buttons (confirm and cancel)
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-md flex items-center justify-center transition-colors duration-200"
          >
            {/* Show spinner when deleting */}
            {isDeleting ? (
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="w-8 h-8 bg-slate-400 hover:bg-slate-500 text-white rounded-md flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        // Delete button (shows on hover)
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-10 h-10 bg-white/80 hover:bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
    
    {/* Hover effect overlay (fades in on hover) */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
    
    {/* Bottom accent line with gradient color */}
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
  </div>
);


}
export default HomeTodoCard

 