/**
 * Workout Splits Domain - Text Map
 *
 * Externalized text strings for the workout splits system.
 * All user-facing text must be defined here (no hardcoded strings in components).
 *
 * Follows critical constraint: No hardcoded strings in components.
 */

export const workoutSplitsText = {
  // ============================================================================
  // PRE-ASSESSMENT
  // ============================================================================
  preAssessment: {
    title: 'Configurar Mi Entrenamiento',
    subtitle: 'Responde estas preguntas para generar tu plan personalizado',
    step1Title: 'Frecuencia de Entrenamiento',
    step1Subtitle: '¿Cuántos días por semana quieres entrenar?',
    step2Title: 'Enfoque de Entrenamiento',
    step2Subtitle: '¿En qué parte del cuerpo quieres enfocarte?',

    frequencyLabel: 'Días por semana',
    frequencyHelp: 'Selecciona entre 3 y 6 días',
    frequency3Days: '3 días',
    frequency4Days: '4 días',
    frequency5Days: '5 días',
    frequency6Days: '6 días',

    focusLabel: 'Enfoque de entrenamiento',
    focusLegs: 'Piernas',
    focusLegsDescription: 'Enfoque en piernas, glúteos y pantorrillas',
    focusArms: 'Brazos',
    focusArmsDescription: 'Enfoque en bíceps, tríceps y antebrazos',
    focusFullBody: 'Cuerpo Completo',
    focusFullBodyDescription: 'Entrenamiento balanceado de todo el cuerpo',
    focusCore: 'Core y Abdomen',
    focusCoreDescription: 'Enfoque en abdominales y músculos del core',

    buttonBack: 'Atrás',
    buttonNext: 'Siguiente',
    buttonGenerate: 'Generar Mi Plan',
    buttonGenerating: 'Generando...',

    previewTitle: 'Vista Previa de Tu Plan',
    previewDescription:
      'Se generarán {{count}} divisiones de entrenamiento basadas en tus preferencias',
    previewSplitLabel: 'División {{letter}}',

    successTitle: '¡Plan Generado!',
    successMessage: 'Tu plan de entrenamiento está listo. ¡Comencemos!',
    successButton: 'Ver Mi Entrenamiento',

    errorTitle: 'Error',
    errorGeneration: 'No pudimos generar tu plan. Por favor, intenta de nuevo.',
    errorInvalidFrequency: 'La frecuencia debe estar entre 3 y 6 días',
    errorInvalidFocus: 'Debes seleccionar un enfoque de entrenamiento'
  },

  // ============================================================================
  // MY WORKOUT DASHBOARD
  // ============================================================================
  dashboard: {
    title: 'Mi Entrenamiento',
    subtitle: 'Tus divisiones de entrenamiento',
    emptyTitle: 'No tienes un plan de entrenamiento',
    emptyDescription:
      'Completa la evaluación para generar tu plan personalizado',
    emptyButton: 'Comenzar Evaluación',

    currentBadge: 'Actual',
    completedBadge: 'Completado',
    upcomingBadge: 'Próximo',

    splitCardTitle: 'División {{letter}}',
    splitCardProgress: '{{completed}} de {{total}} ejercicios',
    splitCardButton: 'Comenzar',
    splitCardButtonResume: 'Continuar',
    splitCardButtonView: 'Ver Detalles',

    lastCompleted: 'Última vez: {{date}}',
    neverCompleted: 'No completado aún',

    streakLabel: 'Racha actual',
    streakValue: '{{count}} días',
    totalWorkoutsLabel: 'Total de entrenamientos',
    totalWorkoutsValue: '{{count}}',

    calendarTitle: 'Calendario de Entrenamientos',
    calendarTooltip: 'Entrenamiento completado',
    calendarEmpty: 'Sin entrenamientos este mes',

    settingsButton: 'Configuración',
    editPlanButton: 'Editar Plan',
    newAssessmentButton: 'Nueva Evaluación'
  },

  // ============================================================================
  // WORKOUT SPLIT DETAIL
  // ============================================================================
  splitDetail: {
    title: 'División {{letter}}: {{name}}',
    subtitle: '{{subtitle}}',
    backButton: 'Volver',

    progressLabel: 'Progreso',
    progressValue: '{{completed}} de {{total}} completados',

    exerciseListTitle: 'Ejercicios',
    exerciseItemSets: '{{sets}} series',
    exerciseItemReps: '{{reps}} reps',
    exerciseItemRest: '{{seconds}}s descanso',
    exerciseItemCompleted: 'Completado',
    exerciseItemPending: 'Pendiente',

    startWorkoutButton: 'Comenzar Entrenamiento',
    resumeWorkoutButton: 'Continuar Entrenamiento',
    finalizeWorkoutButton: 'Finalizar Entrenamiento',
    finalizeWorkoutButtonDisabled: 'Completa todos los ejercicios',

    emptyExercisesTitle: 'Sin ejercicios',
    emptyExercisesDescription: 'Esta división no tiene ejercicios asignados',

    loadingTitle: 'Cargando...',
    loadingExercises: 'Cargando ejercicios...'
  },

  // ============================================================================
  // EXERCISE DETAIL
  // ============================================================================
  exerciseDetail: {
    title: '{{name}}',
    category: 'Categoría: {{category}}',
    description: 'Descripción',
    noDescription: 'Sin descripción disponible',

    targetTitle: 'Objetivo',
    targetSets: '{{sets}} series',
    targetReps: '{{reps}} repeticiones',
    targetWeight: '{{weight}} kg',
    targetRest: '{{seconds}}s de descanso',

    videoTitle: 'Video Tutorial',
    videoUnavailable: 'Video no disponible',

    imageAlt: 'Imagen del ejercicio {{name}}',

    setsTitle: 'Registrar Series',
    setNumber: 'Serie {{number}}',
    weightLabel: 'Peso (kg)',
    weightPlaceholder: 'Ej: 50',
    repsLabel: 'Repeticiones',
    repsPlaceholder: 'Ej: 10',
    notesLabel: 'Notas',
    notesPlaceholder: 'Notas sobre esta serie (opcional)',
    setCompleted: 'Completada',
    setIncomplete: 'Pendiente',

    addSetButton: 'Agregar Serie',
    removeSetButton: 'Eliminar Serie',
    saveButton: 'Guardar',
    savingButton: 'Guardando...',

    historyTitle: 'Historial de Pesos',
    historyEmpty:
      'Completa este ejercicio para comenzar a rastrear tu progreso',
    historyDate: 'Fecha: {{date}}',
    historyWeight: '{{weight}} kg',
    historyReps: '{{reps}} reps',
    historySets: '{{sets}} series',
    historyTrend: 'Tendencia',
    historyTrendIncreasing: 'Aumentando 📈',
    historyTrendDecreasing: 'Disminuyendo 📉',
    historyTrendStable: 'Estable ➡️',
    historyTrendInsufficient: 'Datos insuficientes',

    closeButton: 'Cerrar',
    backButton: 'Volver'
  },

  // ============================================================================
  // FINALIZE WORKOUT
  // ============================================================================
  finalizeWorkout: {
    confirmTitle: '¿Finalizar Entrenamiento?',
    confirmMessage:
      'Has completado {{completed}} de {{total}} ejercicios. ¿Estás seguro de que quieres finalizar?',
    confirmWarningIncomplete:
      'Advertencia: No has completado todos los ejercicios.',
    confirmWarningShortDuration:
      'Advertencia: Tu entrenamiento duró menos de 15 minutos.',
    confirmWarningLongDuration:
      'Advertencia: Tu entrenamiento duró más de 3 horas.',

    ratingLabel: 'Califica tu entrenamiento',
    ratingOptional: '(Opcional)',
    rating1: 'Muy difícil',
    rating2: 'Difícil',
    rating3: 'Moderado',
    rating4: 'Bueno',
    rating5: 'Excelente',

    notesLabel: 'Notas del entrenamiento',
    notesPlaceholder: 'Agrega notas sobre tu entrenamiento (opcional)',

    durationLabel: 'Duración',
    durationValue: '{{minutes}} minutos',

    buttonCancel: 'Cancelar',
    buttonConfirm: 'Finalizar',
    buttonConfirming: 'Finalizando...',

    successTitle: '¡Entrenamiento Completado!',
    successMessage:
      'Excelente trabajo. Tu próxima división es {{splitLetter}}.',
    successButton: 'Ver Mi Entrenamiento',

    errorTitle: 'Error al Finalizar',
    errorMessage:
      'No pudimos finalizar tu entrenamiento. Por favor, intenta de nuevo.',
    errorNoSession: 'No hay una sesión de entrenamiento activa',
    errorInvalidData: 'Datos de finalización inválidos'
  },

  // ============================================================================
  // CALENDAR
  // ============================================================================
  calendar: {
    title: 'Calendario',
    todayButton: 'Hoy',
    prevMonthButton: 'Mes anterior',
    nextMonthButton: 'Mes siguiente',
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    monthsShort: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic'
    ],
    workoutCompletedLabel: 'Entrenamiento completado',
    noWorkoutsLabel: 'Sin entrenamientos',
    collapseButton: 'Ocultar calendario',
    expandButton: 'Mostrar calendario'
  },

  // ============================================================================
  // ERRORS AND VALIDATION
  // ============================================================================
  errors: {
    generic: 'Ocurrió un error. Por favor, intenta de nuevo.',
    unauthorized: 'No estás autorizado para realizar esta acción.',
    notFound: 'No se encontró el recurso solicitado.',
    invalidData: 'Los datos proporcionados son inválidos.',
    networkError: 'Error de conexión. Verifica tu internet.',
    sessionExpired: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',

    assessmentNotFound: 'No se encontró ninguna evaluación activa.',
    splitNotFound: 'No se encontró la división de entrenamiento.',
    exerciseNotFound: 'No se encontró el ejercicio.',
    sessionNotFound: 'No se encontró la sesión de entrenamiento.',

    frequencyTooLow: 'La frecuencia debe ser al menos 3 días por semana',
    frequencyTooHigh: 'La frecuencia debe ser máximo 6 días por semana',
    invalidFocus: 'Enfoque de entrenamiento inválido',

    weightNegative: 'El peso no puede ser negativo',
    weightTooHigh: 'El peso debe ser menor a 500 kg',
    repsTooLow: 'Las repeticiones deben ser al menos 1',
    repsTooHigh: 'Las repeticiones deben ser menor a 100',

    durationTooShort: 'La duración parece muy corta (menos de 1 minuto)',
    durationTooLong: 'La duración no puede ser más de 4 horas'
  },

  // ============================================================================
  // SUCCESS MESSAGES
  // ============================================================================
  success: {
    assessmentCreated: '¡Plan creado exitosamente!',
    workoutStarted: '¡Entrenamiento iniciado! Buena suerte.',
    workoutFinalized: '¡Entrenamiento finalizado! Gran trabajo.',
    exerciseCompleted: 'Ejercicio completado ✓',
    exerciseUncompleted: 'Ejercicio marcado como pendiente',
    setRecorded: 'Serie guardada correctamente',
    weightHistoryUpdated: 'Historial actualizado'
  },

  // ============================================================================
  // LOADING STATES
  // ============================================================================
  loading: {
    generic: 'Cargando...',
    assessment: 'Cargando evaluación...',
    splits: 'Cargando divisiones...',
    exercises: 'Cargando ejercicios...',
    history: 'Cargando historial...',
    calendar: 'Cargando calendario...',
    generating: 'Generando plan...',
    saving: 'Guardando...',
    finalizing: 'Finalizando entrenamiento...'
  },

  // ============================================================================
  // EMPTY STATES
  // ============================================================================
  empty: {
    noAssessment: 'No tienes una evaluación activa',
    noSplits: 'No hay divisiones de entrenamiento',
    noExercises: 'No hay ejercicios en esta división',
    noHistory: 'Sin historial de pesos',
    noWorkouts: 'Aún no has completado ningún entrenamiento',
    noCalendarData: 'Sin datos para mostrar en el calendario'
  },

  // ============================================================================
  // ACCESSIBILITY (ARIA LABELS)
  // ============================================================================
  a11y: {
    splitCard: 'Tarjeta de división de entrenamiento {{letter}}',
    exerciseCheckbox: 'Marcar ejercicio {{name}} como completado',
    calendarDay: 'Día {{date}}',
    calendarWorkoutCompleted: 'Entrenamiento completado el {{date}}',
    progressBar: 'Progreso del entrenamiento: {{percent}} por ciento',
    videoPlayer: 'Reproductor de video del ejercicio {{name}}',
    historyChart: 'Gráfica de historial de pesos para {{name}}',
    closeDialog: 'Cerrar diálogo',
    openExerciseDetail: 'Abrir detalles del ejercicio {{name}}'
  }
} as const;

/**
 * Type-safe text accessor
 * Ensures all text keys are valid at compile time
 */
export type WorkoutSplitsTextKey = keyof typeof workoutSplitsText;

/**
 * Helper function to get text with interpolation
 * Usage: getText('dashboard.splitCardProgress', { completed: 3, total: 5 })
 */
export function getWorkoutSplitsText(
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: string | number | Record<string, string | number> | undefined =
    workoutSplitsText;

  for (const k of keys) {
    value = (value as Record<string, string | number>)[k];
    if (value === undefined) {
      console.warn(`Text key not found: ${key}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Text key is not a string: ${key}`);
    return key;
  }

  if (!params) {
    return value;
  }

  // Simple interpolation: replace {{key}} with params[key]
  return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
    const paramValue = params[paramKey];
    return paramValue !== undefined ? String(paramValue) : `{{${paramKey}}}`;
  });
}
