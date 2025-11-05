/**
 * Text map for workouts domain
 * All text content for dashboard, active workout, and workout history
 */

export const workoutsTextMap = {
  // Dashboard Page
  dashboard: {
    heading: 'Dashboard',
    welcome: 'Welcome back, {name}!',
    stats: {
      streak: {
        label: 'Day Streak',
        ariaLabel: 'Current streak: {count} days'
      },
      weeklyWorkouts: {
        label: 'This Week',
        ariaLabel: 'Workouts this week: {count}'
      },
      totalWorkouts: {
        label: 'Total Workouts',
        ariaLabel: 'Total workouts: {count}'
      }
    },
    trainToday: {
      heading: 'Train Today',
      button: 'Start Workout',
      noRoutine: 'No routine scheduled for today',
      setRoutine: 'Set Your Active Routine'
    },
    recentActivity: {
      heading: 'Recent Activity',
      empty: 'No workouts yet. Start your first session!',
      viewAll: 'View All History'
    },
    quickActions: {
      heading: 'Quick Actions',
      routines: 'My Routines',
      library: 'Exercise Library',
      history: 'View History'
    }
  },

  // Active Workout Page
  workout: {
    active: {
      exit: 'Exit',
      finish: 'Finish',
      timer: 'Duration',
      progress: 'Exercise {current} of {total}',
      target: 'Target: {sets} sets x {reps} @ {weight}kg',
      set: 'Set {number}',
      completed: 'Completed',
      weight: {
        label: 'Weight (kg)',
        placeholder: '0'
      },
      reps: {
        label: 'Reps',
        placeholder: '0'
      },
      complete: 'Complete Set',
      copySet: 'Copy Set {number}',
      addSet: 'Add Set',
      notes: {
        label: 'Notes (optional)',
        placeholder: 'How did it feel?'
      },
      nextExercise: 'Next Exercise',
      previousExercise: 'Previous Exercise',
      exitConfirm: {
        title: 'Exit Workout?',
        message: 'Your progress will be saved as a draft',
        yes: 'Exit',
        no: 'Continue Workout'
      }
    },
    summary: {
      heading: 'Workout Complete!',
      congratulations: 'Great job! You crushed it!',
      duration: 'Duration: {time}',
      exercises: 'Exercises: {count}',
      volume: 'Total Volume: {volume} kg',
      rating: {
        label: 'Rate your session',
        ariaLabel: 'Rate {stars} out of 5 stars'
      },
      notes: {
        label: 'Session notes (optional)',
        placeholder: 'How did you feel?'
      },
      finish: 'Finish Workout',
      viewDetails: 'View Workout Details'
    }
  },

  // Workout History Page
  history: {
    heading: 'Workout History',
    filter: {
      date: {
        label: 'Date Range',
        lastWeek: 'Last Week',
        lastMonth: 'Last Month',
        last3Months: 'Last 3 Months',
        all: 'All Time'
      },
      routine: {
        label: 'Routine',
        all: 'All Routines'
      }
    },
    card: {
      duration: '{duration} min',
      exercises: '{count} exercises',
      volume: '{volume} kg volume',
      rating: 'Rated {stars} out of 5'
    },
    loadMore: 'Load More',
    empty: {
      heading: 'No workouts yet',
      message: 'Start your first workout to see your history here',
      action: 'Go to Dashboard'
    }
  },

  // Session Detail Page
  sessionDetail: {
    back: 'Back',
    date: '{date}',
    duration: 'Duration: {time}',
    exercisesCount: 'Exercises: {count}',
    volume: 'Volume: {volume} kg',
    notes: {
      heading: 'Session Notes',
      empty: 'No notes for this session'
    },
    exercises: {
      heading: 'Exercises'
    },
    set: 'Set {number}: {weight}kg x {reps}',
    exerciseNote: 'Note: {note}',
    repeatWorkout: 'Repeat Workout',
    delete: {
      confirm: {
        title: 'Delete Workout?',
        message: 'This action cannot be undone',
        yes: 'Delete',
        no: 'Cancel'
      }
    }
  },

  // Common
  common: {
    loading: 'Loading...',
    error: {
      generic: 'Something went wrong. Please try again.',
      network: 'Network error. Please check your connection.',
      notFound: 'Not found'
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View'
    }
  }
} as const;
