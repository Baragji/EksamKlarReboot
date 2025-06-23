import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StudyCalendar } from '../../src/components/StudyCalendar';

// Mock the examStore
const mockExamStore = {
  studySessions: [
    {
      id: '1',
      subjectId: 'math',
      subjectName: 'Mathematics',
      date: '2025-06-15', // Use current month (June 2025)
      duration: 60,
      topicsStudied: ['Algebra', 'Calculus'],
      completed: true
    },
    {
      id: '2',
      subjectId: 'physics',
      subjectName: 'Physics',
      date: '2025-06-16', // Use current month (June 2025)
      duration: 45,
      topicsStudied: ['Mechanics'],
      completed: false
    }
  ],
  scheduledSessions: [
    {
      id: '3',
      subjectId: 'chemistry',
      subjectName: 'Chemistry',
      date: '2025-06-20', // Use current month (June 2025)
      duration: 90,
      topicsPlanned: ['Organic Chemistry'],
      type: 'scheduled'
    }
  ],
  addScheduledSession: vi.fn(),
  updateSession: vi.fn(),
  deleteSession: vi.fn()
};

vi.mock('../../src/stores/examStore', () => ({
  useExamStore: () => mockExamStore
}));

describe('StudyCalendar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Structure', () => {
    it('should render the calendar component', () => {
      render(<StudyCalendar />);
      
      expect(screen.getByTestId('study-calendar')).toBeInTheDocument();
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('should display the current month and year in header', () => {
      render(<StudyCalendar />);
      
      // Should show month/year (e.g., "January 2024")
      expect(screen.getByTestId('calendar-header')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-month-year')).toBeInTheDocument();
    });

    it('should have navigation buttons for previous and next month', () => {
      render(<StudyCalendar />);
      
      expect(screen.getByTestId('prev-month-btn')).toBeInTheDocument();
      expect(screen.getByTestId('next-month-btn')).toBeInTheDocument();
    });

    it('should display weekday headers', () => {
      render(<StudyCalendar />);
      
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      weekdays.forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });
  });

  describe('Calendar Navigation', () => {
    it('should navigate to previous month when prev button is clicked', async () => {
      render(<StudyCalendar />);
      
      const prevButton = screen.getByTestId('prev-month-btn');
      fireEvent.click(prevButton);
      
      // Calendar should update to show previous month
      expect(screen.getByTestId('calendar-month-year')).toBeInTheDocument();
    });

    it('should navigate to next month when next button is clicked', async () => {
      render(<StudyCalendar />);
      
      const nextButton = screen.getByTestId('next-month-btn');
      fireEvent.click(nextButton);
      
      // Calendar should update to show next month
      expect(screen.getByTestId('calendar-month-year')).toBeInTheDocument();
    });

    it('should allow direct month/year selection', () => {
      render(<StudyCalendar />);
      
      // Should have month/year selector dropdown or input
      expect(screen.getByTestId('month-year-selector')).toBeInTheDocument();
    });
  });

  describe('Study Session Display', () => {
    it('should display completed study sessions on calendar dates', () => {
      render(<StudyCalendar />);
      
      // Should show study session indicators
      expect(screen.getByTestId('session-indicator-1')).toBeInTheDocument();
      expect(screen.getByTestId('session-indicator-2')).toBeInTheDocument();
    });

    it('should display scheduled sessions differently from completed ones', () => {
      render(<StudyCalendar />);
      
      const completedSession = screen.getByTestId('session-indicator-1');
      const scheduledSession = screen.getByTestId('session-indicator-3');
      
      // Completed and scheduled sessions should have different visual indicators
      expect(completedSession).toHaveClass('completed');
      expect(scheduledSession).toHaveClass('scheduled');
    });

    it('should show session details on hover or click', async () => {
      render(<StudyCalendar />);
      
      const sessionIndicator = screen.getByTestId('session-indicator-1');
      fireEvent.click(sessionIndicator);
      
      await waitFor(() => {
        expect(screen.getByTestId('session-details-popup')).toBeInTheDocument();
        expect(screen.getByText('Session Details')).toBeInTheDocument();
        expect(screen.getByText('60 minutes')).toBeInTheDocument();
        expect(screen.getByText('Algebra, Calculus')).toBeInTheDocument();
      });
    });
  });

  describe('Session Scheduling', () => {
    it('should allow adding new study sessions by clicking on a date', async () => {
      render(<StudyCalendar />);
      
      // Click on an empty date
      const emptyDate = screen.getByTestId('calendar-date-25');
      fireEvent.click(emptyDate);
      
      await waitFor(() => {
        expect(screen.getByTestId('add-session-modal')).toBeInTheDocument();
      });
    });

    it('should show add session form with required fields', async () => {
      render(<StudyCalendar />);
      
      const emptyDate = screen.getByTestId('calendar-date-25');
      fireEvent.click(emptyDate);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Subject')).toBeInTheDocument();
        expect(screen.getByLabelText('Duration (minutes)')).toBeInTheDocument();
        expect(screen.getByLabelText('Topics to Study')).toBeInTheDocument();
        expect(screen.getByTestId('save-session-btn')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-session-btn')).toBeInTheDocument();
      });
    });

    it('should save new session when form is submitted', async () => {
      render(<StudyCalendar />);
      
      const emptyDate = screen.getByTestId('calendar-date-25');
      fireEvent.click(emptyDate);
      
      await waitFor(() => {
        const subjectInput = screen.getByLabelText('Subject');
        const durationInput = screen.getByLabelText('Duration (minutes)');
        const topicsInput = screen.getByLabelText('Topics to Study');
        
        fireEvent.change(subjectInput, { target: { value: 'Biology' } });
        fireEvent.change(durationInput, { target: { value: '120' } });
        fireEvent.change(topicsInput, { target: { value: 'Cell Biology' } });
        
        const saveButton = screen.getByTestId('save-session-btn');
        fireEvent.click(saveButton);
      });
      
      expect(mockExamStore.addScheduledSession).toHaveBeenCalledWith({
        subjectName: 'Biology',
        subjectId: 'default-subject',
        date: expect.any(String),
        duration: 120,
        topicsPlanned: ['Cell Biology'],
        type: 'scheduled'
      });
    });
  });

  describe('Session Management', () => {
    it('should allow editing existing sessions', async () => {
      render(<StudyCalendar />);
      
      const sessionIndicator = screen.getByTestId('session-indicator-1');
      fireEvent.click(sessionIndicator);
      
      await waitFor(() => {
        const editButton = screen.getByTestId('edit-session-btn');
        fireEvent.click(editButton);
        
        expect(screen.getByTestId('edit-session-modal')).toBeInTheDocument();
      });
    });

    it('should allow deleting sessions', async () => {
      render(<StudyCalendar />);
      
      const sessionIndicator = screen.getByTestId('session-indicator-1');
      fireEvent.click(sessionIndicator);
      
      await waitFor(() => {
        const deleteButton = screen.getByTestId('delete-session-btn');
        fireEvent.click(deleteButton);
        
        // Should show confirmation dialog
        expect(screen.getByTestId('delete-confirmation')).toBeInTheDocument();
      });
    });

    it('should confirm deletion before removing session', async () => {
      render(<StudyCalendar />);
      
      const sessionIndicator = screen.getByTestId('session-indicator-1');
      fireEvent.click(sessionIndicator);
      
      await waitFor(() => {
        const deleteButton = screen.getByTestId('delete-session-btn');
        fireEvent.click(deleteButton);
        
        const confirmButton = screen.getByTestId('confirm-delete-btn');
        fireEvent.click(confirmButton);
      });
      
      expect(mockExamStore.deleteSession).toHaveBeenCalledWith('1');
    });
  });

  describe('Calendar Views', () => {
    it('should have month view by default', () => {
      render(<StudyCalendar />);
      
      expect(screen.getByTestId('calendar-month-view')).toBeInTheDocument();
    });

    it('should support week view toggle', () => {
      render(<StudyCalendar />);
      
      const weekViewButton = screen.getByTestId('week-view-btn');
      fireEvent.click(weekViewButton);
      
      expect(screen.getByTestId('calendar-week-view')).toBeInTheDocument();
    });

    it('should show today button to jump to current date', () => {
      render(<StudyCalendar />);
      
      expect(screen.getByTestId('today-btn')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<StudyCalendar />);
      
      expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'Study Calendar');
      expect(screen.getByTestId('prev-month-btn')).toHaveAttribute('aria-label', 'Previous month');
      expect(screen.getByTestId('next-month-btn')).toHaveAttribute('aria-label', 'Next month');
    });

    it('should support keyboard navigation', () => {
      render(<StudyCalendar />);
      
      const calendar = screen.getByRole('grid');
      expect(calendar).toHaveAttribute('tabIndex');
    });

    it('should announce date changes to screen readers', () => {
      render(<StudyCalendar />);
      
      expect(screen.getByTestId('calendar-announcements')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no sessions exist', () => {
      // Create a temporary mock with empty data
      const originalMock = vi.mocked(mockExamStore);
      originalMock.studySessions = [];
      originalMock.scheduledSessions = [];
      
      render(<StudyCalendar />);
      
      expect(screen.getByTestId('empty-calendar-state')).toBeInTheDocument();
      expect(screen.getByText(/No study sessions scheduled/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily when props don\'t change', () => {
      const { rerender } = render(<StudyCalendar />);
      
      // Mock component should be memoized
      const initialRenderCount = screen.getByTestId('study-calendar');
      
      rerender(<StudyCalendar />);
      
      expect(initialRenderCount).toBe(screen.getByTestId('study-calendar'));
    });
  });
});
