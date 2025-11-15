/**
 * Text map for routines domain
 * All text content for routine list, detail, and editor
 */

export const routinesTextMap = {
  // Routines List Page
  routines: {
    heading: 'My Routines',
    create: 'Create Routine',
    active: {
      badge: 'Active'
    },
    card: {
      days: '{count} days',
      day: '1 day',
      exercises: '{count} exercises',
      exercise: '1 exercise',
      lastUsed: 'Last used {date}',
      neverUsed: 'Never used'
    },
    actions: {
      view: 'View',
      edit: 'Edit',
      activate: 'Activate',
      deactivate: 'Deactivate',
      archive: 'Archive',
      delete: 'Delete',
      duplicate: 'Duplicate'
    },
    delete: {
      confirm: {
        title: 'Delete Routine?',
        message:
          'This routine has workout history. It will be archived instead of deleted.',
        messageNoHistory: 'This routine will be permanently deleted.',
        yes: 'Archive',
        yesDelete: 'Delete',
        no: 'Cancel'
      }
    },
    activate: {
      confirm: {
        title: 'Activate Routine?',
        message: 'This will replace your current active routine',
        yes: 'Activate',
        no: 'Cancel'
      },
      success: 'Routine activated successfully',
      error: 'Failed to activate routine'
    },
    empty: {
      heading: 'No routines yet',
      message: 'Create your first routine to start tracking workouts',
      action: 'Create Routine'
    }
  },

  // Routine Detail Page
  routineDetail: {
    back: 'Back',
    active: {
      badge: 'Active'
    },
    edit: 'Edit Routine',
    activate: 'Activate',
    archive: 'Archive',
    delete: 'Delete',
    summary: '{days} days • {exercises} total exercises',
    day: {
      heading: 'Day {number}: {name}'
    },
    exercise: {
      config: '{sets} sets x {reps} @ {weight}kg',
      configNoWeight: '{sets} sets x {reps}',
      note: 'Note: {note}'
    },
    startWorkout: 'Start Workout',
    selectDay: 'Select Day to Start'
  },

  // Routine Editor Page
  routineEditor: {
    new: {
      title: 'New Routine'
    },
    edit: {
      title: 'Edit Routine'
    },
    name: {
      label: 'Routine Name',
      placeholder: 'e.g., Push-Pull-Legs',
      required: 'Routine name is required'
    },
    days: {
      heading: 'Days',
      add: 'Add Day',
      empty: 'No days yet. Add your first day to get started.'
    },
    day: {
      name: {
        label: 'Day Name',
        placeholder: 'e.g., Push',
        required: 'Day name is required'
      },
      exercises: {
        heading: 'Exercises',
        count: '{count} exercises',
        empty: 'No exercises yet. Add your first exercise.'
      },
      add: 'Add Exercise',
      edit: 'Edit Day',
      delete: 'Delete Day'
    },
    exercise: {
      sets: '{sets} sets x {reps}',
      edit: 'Edit',
      remove: 'Remove',
      moveUp: 'Move Up',
      moveDown: 'Move Down'
    },
    save: 'Save Routine',
    cancel: 'Cancel',
    saveSuccess: 'Routine saved successfully',
    saveError: 'Failed to save routine'
  },

  // Exercise Picker Modal
  exercisePicker: {
    title: 'Add Exercise',
    search: {
      placeholder: 'Search exercises',
      noResults: 'No exercises found for "{query}"'
    },
    category: {
      all: 'All',
      chest: 'Chest',
      back: 'Back',
      legs: 'Legs',
      shoulders: 'Shoulders',
      arms: 'Arms',
      core: 'Core',
      cardio: 'Cardio'
    },
    createCustom: 'Create Custom Exercise',
    select: 'Select'
  },

  // Exercise Config Modal
  exerciseConfig: {
    title: '{exercise}',
    sets: {
      label: 'Target Sets',
      placeholder: '3'
    },
    reps: {
      label: 'Target Reps',
      placeholder: '10'
    },
    weight: {
      label: 'Target Weight (kg)',
      placeholder: 'Optional'
    },
    notes: {
      label: 'Notes (optional)',
      placeholder: 'Any special instructions?'
    },
    add: 'Add to Day',
    save: 'Save Changes'
  },

  // Common
  common: {
    loading: 'Loading...',
    error: {
      generic: 'Something went wrong. Please try again.',
      notFound: 'Routine not found'
    }
  }
} as const;
