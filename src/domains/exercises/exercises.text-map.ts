/**
 * Text map for exercises domain
 * All text content for exercises list and management
 */

export const exercisesTextMap = {
  // Exercises List Page
  exercises: {
    heading: 'Exercises',
    subheading: 'Manage your exercise library',
    create: 'Create Custom Exercise',
    search: {
      placeholder: 'Search exercises...'
    },
    filters: {
      all: 'All',
      predefined: 'Predefined',
      custom: 'My Custom'
    },
    categories: {
      all: 'All Categories',
      CHEST: 'Chest',
      BACK: 'Back',
      LEGS: 'Legs',
      SHOULDERS: 'Shoulders',
      ARMS: 'Arms',
      CORE: 'Core',
      CARDIO: 'Cardio'
    },
    card: {
      predefined: 'Predefined',
      custom: 'Custom'
    },
    actions: {
      edit: 'Edit',
      delete: 'Delete'
    },
    delete: {
      confirm: {
        title: 'Delete Exercise?',
        message:
          'This exercise will be permanently deleted. This action cannot be undone.',
        messageInUse:
          'This exercise is being used in routines or workouts and cannot be deleted.',
        yes: 'Delete',
        no: 'Cancel'
      },
      success: 'Exercise deleted successfully',
      error: 'Failed to delete exercise'
    },
    empty: {
      heading: 'No exercises found',
      message: 'Try adjusting your filters or create a custom exercise',
      action: 'Create Custom Exercise'
    }
  },

  // Create Custom Exercise Modal/Form
  createExercise: {
    title: 'Create Custom Exercise',
    name: {
      label: 'Exercise Name',
      placeholder: 'e.g., Cable Crossover',
      required: 'Exercise name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name must be less than 100 characters'
    },
    category: {
      label: 'Category',
      placeholder: 'Select a category',
      required: 'Category is required'
    },
    description: {
      label: 'Description (Optional)',
      placeholder: 'Add notes about form, tips, or variations...',
      maxLength: 'Description must be less than 500 characters'
    },
    submit: 'Create Exercise',
    cancel: 'Cancel',
    success: 'Custom exercise created successfully',
    error: {
      generic: 'Failed to create exercise',
      duplicate: 'You already have an exercise with this name'
    }
  },

  // Common
  common: {
    loading: 'Loading exercises...',
    error: {
      generic: 'Something went wrong. Please try again.',
      notFound: 'Exercise not found'
    }
  }
} as const;
