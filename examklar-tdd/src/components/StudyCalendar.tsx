import { useState, memo } from 'react';
import { useExamStore } from '../stores/examStore';
import type { StudySession } from '../stores/examStore';

interface AddSessionFormData {
  subjectName: string;
  duration: number;
  topicsPlanned: string[];
  type: 'scheduled';
}

export const StudyCalendar = memo(() => {
  const { studySessions, scheduledSessions, subjects, addScheduledSession, updateSession, deleteSession } = useExamStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  // Combine all sessions for display
  const allSessions = [
    ...studySessions,
    ...scheduledSessions.map(session => ({ ...session, completed: false }))
  ];

  // Calendar navigation
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Session handlers
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowAddModal(true);
  };

  const handleSessionClick = (session: StudySession) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  const handleAddSession = (formData: AddSessionFormData) => {
    // Use the first subject if available, or create a default one
    const defaultSubjectId = subjects?.length > 0 ? subjects[0].id : 'default-subject'
    
    addScheduledSession({
      ...formData,
      subjectId: defaultSubjectId,
      date: selectedDate
    });
    setShowAddModal(false);
  };

  const handleEditSession = () => {
    setShowSessionDetails(false);
    setShowEditModal(true);
  };

  const handleDeleteSession = () => {
    setShowSessionDetails(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedSession) {
      deleteSession(selectedSession.id);
    }
    setShowDeleteConfirm(false);
    setSelectedSession(null);
  };

  // Format current month/year
  const monthYearText = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Generate calendar days (simplified - just render a grid)
  const renderCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const sessionsForDate = allSessions.filter(session => session.date === dateStr);
      
      days.push(
        <div
          key={i}
          data-testid={`calendar-date-${i}`}
          className="calendar-date border p-2 min-h-[60px] cursor-pointer hover:bg-gray-50"
          onClick={() => handleDateClick(dateStr)}
        >
          <div className="font-medium">{i}</div>
          <div className="mt-1">
            {sessionsForDate.map(session => (
              <div
                key={session.id}
                data-testid={`session-indicator-${session.id}`}
                className={`text-xs p-1 mb-1 rounded cursor-pointer ${
                  session.completed ? 'bg-green-100 text-green-800 completed' : 'bg-blue-100 text-blue-800 scheduled'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSessionClick(session);
                }}
              >
                {session.subjectName}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  // Check if calendar is empty
  const isEmpty = allSessions.length === 0;

  return (
    <div data-testid="study-calendar" className="study-calendar">
      {/* Screen Reader Announcements */}
      <div data-testid="calendar-announcements" aria-live="polite" className="sr-only">
        Calendar showing {monthYearText}
      </div>

      {/* Calendar Header */}
      <div data-testid="calendar-header" className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            data-testid="prev-month-btn"
            aria-label="Previous month"
            onClick={navigatePrevious}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            ←
          </button>
          
          <div data-testid="month-year-selector" className="relative">
            <h2 data-testid="calendar-month-year" className="text-xl font-semibold">
              {monthYearText}
            </h2>
          </div>
          
          <button
            data-testid="next-month-btn"
            aria-label="Next month"
            onClick={navigateNext}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            →
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            data-testid="today-btn"
            onClick={goToToday}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Today
          </button>
          
          <button
            data-testid={viewMode === 'week' ? 'month-view-btn' : 'week-view-btn'}
            onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            {viewMode === 'month' ? 'Week' : 'Month'} View
          </button>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div data-testid="empty-calendar-state" className="text-center py-12">
          <p className="text-gray-500 text-lg">No study sessions scheduled</p>
          <p className="text-gray-400 mt-2">Click on any date to add your first study session</p>
        </div>
      )}

      {/* Calendar Grid */}
      <div
        role="grid"
        aria-label="Study Calendar"
        tabIndex={0}
        data-testid={viewMode === 'month' ? 'calendar-month-view' : 'calendar-week-view'}
        className="border rounded-lg overflow-hidden"
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 font-medium text-center border-b">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div data-testid="add-session-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Study Session</h3>
            <AddSessionForm
              onSave={handleAddSession}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditModal && selectedSession && (
        <div data-testid="edit-session-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Study Session</h3>
            <EditSessionForm
              session={selectedSession}
              onSave={(updatedSession) => {
                // Ensure all required fields are present
                const completeSession: StudySession = {
                  ...selectedSession,
                  ...updatedSession,
                  createdAt: selectedSession.createdAt || new Date()
                }
                updateSession(completeSession);
                setShowEditModal(false);
                setSelectedSession(null);
              }}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}

      {/* Session Details Popup */}
      {showSessionDetails && selectedSession && (
        <div data-testid="session-details-popup" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Session Details</h3>
            <div className="space-y-2">
              <p><strong>Subject:</strong> {selectedSession.subjectName}</p>
              <p><strong>Duration:</strong> {selectedSession.duration} minutes</p>
              <p><strong>Topics:</strong> {(selectedSession.topicsStudied || selectedSession.topicsPlanned || []).join(', ')}</p>
              <p><strong>Status:</strong> {selectedSession.completed ? 'Completed' : 'Scheduled'}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                data-testid="edit-session-btn"
                onClick={handleEditSession}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                data-testid="delete-session-btn"
                onClick={handleDeleteSession}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowSessionDetails(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div data-testid="delete-confirmation" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this study session?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                data-testid="confirm-delete-btn"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

StudyCalendar.displayName = 'StudyCalendar';

// Add Session Form Component
interface AddSessionFormProps {
  onSave: (formData: AddSessionFormData) => void;
  onCancel: () => void;
}

const AddSessionForm = ({ onSave, onCancel }: AddSessionFormProps) => {
  const [formData, setFormData] = useState<AddSessionFormData>({
    subjectName: '',
    duration: 60,
    topicsPlanned: [],
    type: 'scheduled'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={formData.subjectName}
          onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="duration" className="block text-sm font-medium mb-1">
          Duration (minutes)
        </label>
        <input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="topics" className="block text-sm font-medium mb-1">
          Topics to Study
        </label>
        <input
          id="topics"
          type="text"
          onChange={(e) => setFormData({ 
            ...formData, 
            topicsPlanned: e.target.value.split(',').map(t => t.trim()).filter(t => t)
          })}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter topics separated by commas"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          data-testid="cancel-session-btn"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="save-session-btn"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

// Edit Session Form Component
interface EditSessionFormProps {
  session: StudySession;
  onSave: (session: StudySession) => void;
  onCancel: () => void;
}

const EditSessionForm = ({ session, onSave, onCancel }: EditSessionFormProps) => {
  const [formData, setFormData] = useState({
    subjectName: session.subjectName,
    duration: session.duration,
    topics: (session.topicsStudied || session.topicsPlanned || []).join(', ')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSession = {
      ...session,
      subjectName: formData.subjectName,
      duration: formData.duration,
      ...(session.completed 
        ? { topicsStudied: formData.topics.split(',').map(t => t.trim()).filter(t => t) }
        : { topicsPlanned: formData.topics.split(',').map(t => t.trim()).filter(t => t) }
      )
    };
    onSave(updatedSession);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="edit-subject" className="block text-sm font-medium mb-1">
          Subject
        </label>
        <input
          id="edit-subject"
          type="text"
          value={formData.subjectName}
          onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="edit-duration" className="block text-sm font-medium mb-1">
          Duration (minutes)
        </label>
        <input
          id="edit-duration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="edit-topics" className="block text-sm font-medium mb-1">
          Topics
        </label>
        <input
          id="edit-topics"
          type="text"
          value={formData.topics}
          onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter topics separated by commas"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
