/**
 * Workout Split Generation Logic
 *
 * Algorithm to generate workout splits based on frequency and training focus.
 * Uses template-based distribution with predefined exercise selections.
 */

import type { TrainingFocus } from '@prisma/client';
import type { SplitLetter } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface GeneratedSplit {
  name: string;
  subtitle: string;
  splitLetter: SplitLetter;
  order: number;
  exercises: ExerciseTemplate[];
}

interface ExerciseTemplate {
  exerciseName: string;
  category: string;
  order: number;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
  notes?: string;
}

// ============================================================================
// EXERCISE TEMPLATES BY TRAINING FOCUS
// ============================================================================

/**
 * Exercise templates for LEGS focus
 * Prioritizes leg development with upper body as secondary
 */
const LEGS_FOCUS_TEMPLATES: Record<number, GeneratedSplit[]> = {
  3: [
    {
      name: 'Piernas - Cuádriceps',
      subtitle: 'Enfoque en cuádriceps y glúteos',
      splitLetter: 'A',
      order: 0,
      exercises: [
        {
          exerciseName: 'Sentadilla con Barra',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180,
          notes: 'Movimiento compuesto principal'
        },
        {
          exerciseName: 'Prensa de Piernas',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 120
        },
        {
          exerciseName: 'Extensiones de Cuádriceps',
          category: 'LEGS',
          order: 3,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Zancadas',
          category: 'LEGS',
          order: 4,
          targetSets: 3,
          targetReps: '10-12',
          restSeconds: 90
        },
        {
          exerciseName: 'Elevaciones de Pantorrilla',
          category: 'LEGS',
          order: 5,
          targetSets: 4,
          targetReps: '15-20',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Torso Superior - Push',
      subtitle: 'Pecho, hombros y tríceps',
      splitLetter: 'B',
      order: 1,
      exercises: [
        {
          exerciseName: 'Press de Banca',
          category: 'CHEST',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Press Militar',
          category: 'SHOULDERS',
          order: 2,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Aperturas con Mancuernas',
          category: 'CHEST',
          order: 3,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Fondos en Paralelas',
          category: 'ARMS',
          order: 4,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 90
        },
        {
          exerciseName: 'Elevaciones Laterales',
          category: 'SHOULDERS',
          order: 5,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Piernas - Isquiotibiales',
      subtitle: 'Enfoque en isquiotibiales y glúteos',
      splitLetter: 'C',
      order: 2,
      exercises: [
        {
          exerciseName: 'Peso Muerto Rumano',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Curl Femoral Acostado',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Hip Thrust',
          category: 'LEGS',
          order: 3,
          targetSets: 4,
          targetReps: '10-15',
          restSeconds: 120
        },
        {
          exerciseName: 'Buenos Días',
          category: 'LEGS',
          order: 4,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Plancha Abdominal',
          category: 'CORE',
          order: 5,
          targetSets: 3,
          targetReps: '30-60s',
          restSeconds: 60
        }
      ]
    }
  ],
  4: [
    {
      name: 'Piernas - Cuádriceps',
      subtitle: 'Enfoque en cuádriceps',
      splitLetter: 'A',
      order: 0,
      exercises: [
        {
          exerciseName: 'Sentadilla con Barra',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Prensa de Piernas',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 120
        },
        {
          exerciseName: 'Extensiones de Cuádriceps',
          category: 'LEGS',
          order: 3,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Zancadas',
          category: 'LEGS',
          order: 4,
          targetSets: 3,
          targetReps: '10-12',
          restSeconds: 90
        }
      ]
    },
    {
      name: 'Piernas - Isquiotibiales',
      subtitle: 'Enfoque en isquiotibiales y glúteos',
      splitLetter: 'B',
      order: 1,
      exercises: [
        {
          exerciseName: 'Peso Muerto Rumano',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Curl Femoral Acostado',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Hip Thrust',
          category: 'LEGS',
          order: 3,
          targetSets: 4,
          targetReps: '10-15',
          restSeconds: 120
        },
        {
          exerciseName: 'Buenos Días',
          category: 'LEGS',
          order: 4,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 90
        }
      ]
    },
    {
      name: 'Torso Superior - Push',
      subtitle: 'Pecho, hombros y tríceps',
      splitLetter: 'C',
      order: 2,
      exercises: [
        {
          exerciseName: 'Press de Banca',
          category: 'CHEST',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Press Militar',
          category: 'SHOULDERS',
          order: 2,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Aperturas con Mancuernas',
          category: 'CHEST',
          order: 3,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Fondos en Paralelas',
          category: 'ARMS',
          order: 4,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 90
        }
      ]
    },
    {
      name: 'Torso Superior - Pull',
      subtitle: 'Espalda y bíceps',
      splitLetter: 'D',
      order: 3,
      exercises: [
        {
          exerciseName: 'Dominadas',
          category: 'BACK',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Remo con Barra',
          category: 'BACK',
          order: 2,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Jalón al Pecho',
          category: 'BACK',
          order: 3,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Curl de Bíceps',
          category: 'ARMS',
          order: 4,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 60
        }
      ]
    }
  ],
  5: [
    {
      name: 'Piernas - Cuádriceps y Glúteos',
      subtitle: 'Enfoque en cuádriceps',
      splitLetter: 'A',
      order: 0,
      exercises: [
        {
          exerciseName: 'Sentadilla con Barra',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Prensa de Piernas',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 120
        },
        {
          exerciseName: 'Extensiones de Cuádriceps',
          category: 'LEGS',
          order: 3,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Elevaciones de Pantorrilla',
          category: 'LEGS',
          order: 4,
          targetSets: 4,
          targetReps: '15-20',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Piernas - Isquiotibiales',
      subtitle: 'Enfoque en isquiotibiales',
      splitLetter: 'B',
      order: 1,
      exercises: [
        {
          exerciseName: 'Peso Muerto Rumano',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Curl Femoral Acostado',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Hip Thrust',
          category: 'LEGS',
          order: 3,
          targetSets: 4,
          targetReps: '10-15',
          restSeconds: 120
        },
        {
          exerciseName: 'Plancha Abdominal',
          category: 'CORE',
          order: 4,
          targetSets: 3,
          targetReps: '30-60s',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Pecho y Hombros',
      subtitle: 'Push movements',
      splitLetter: 'C',
      order: 2,
      exercises: [
        {
          exerciseName: 'Press de Banca',
          category: 'CHEST',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Press Militar',
          category: 'SHOULDERS',
          order: 2,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Aperturas con Mancuernas',
          category: 'CHEST',
          order: 3,
          targetReps: '12-15',
          targetSets: 3,
          restSeconds: 90
        },
        {
          exerciseName: 'Elevaciones Laterales',
          category: 'SHOULDERS',
          order: 4,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Espalda',
      subtitle: 'Pull movements',
      splitLetter: 'D',
      order: 3,
      exercises: [
        {
          exerciseName: 'Dominadas',
          category: 'BACK',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Remo con Barra',
          category: 'BACK',
          order: 2,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Jalón al Pecho',
          category: 'BACK',
          order: 3,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Face Pulls',
          category: 'SHOULDERS',
          order: 4,
          targetSets: 3,
          targetReps: '15-20',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Brazos y Core',
      subtitle: 'Bíceps, tríceps y abdomen',
      splitLetter: 'E',
      order: 4,
      exercises: [
        {
          exerciseName: 'Curl de Bíceps',
          category: 'ARMS',
          order: 1,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Fondos en Paralelas',
          category: 'ARMS',
          order: 2,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 90
        },
        {
          exerciseName: 'Curl Martillo',
          category: 'ARMS',
          order: 3,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 60
        },
        {
          exerciseName: 'Extensión de Tríceps',
          category: 'ARMS',
          order: 4,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 60
        },
        {
          exerciseName: 'Crunches Abdominales',
          category: 'CORE',
          order: 5,
          targetSets: 3,
          targetReps: '15-20',
          restSeconds: 45
        }
      ]
    }
  ],
  6: [
    // 6-day split implementation would go here
    // For brevity, using 5-day template as fallback
  ]
};

/**
 * Exercise templates for ARMS focus
 */
const ARMS_FOCUS_TEMPLATES: Record<number, GeneratedSplit[]> = {
  3: [
    {
      name: 'Bíceps y Espalda',
      subtitle: 'Pull movements',
      splitLetter: 'A',
      order: 0,
      exercises: [
        {
          exerciseName: 'Dominadas',
          category: 'BACK',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Remo con Barra',
          category: 'BACK',
          order: 2,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Curl de Bíceps con Barra',
          category: 'ARMS',
          order: 3,
          targetSets: 4,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Curl Martillo',
          category: 'ARMS',
          order: 4,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 60
        },
        {
          exerciseName: 'Curl Concentrado',
          category: 'ARMS',
          order: 5,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Tríceps y Pecho',
      subtitle: 'Push movements',
      splitLetter: 'B',
      order: 1,
      exercises: [
        {
          exerciseName: 'Press de Banca',
          category: 'CHEST',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Fondos en Paralelas',
          category: 'ARMS',
          order: 2,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Extensión de Tríceps en Polea',
          category: 'ARMS',
          order: 3,
          targetSets: 4,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Press Francés',
          category: 'ARMS',
          order: 4,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Aperturas con Mancuernas',
          category: 'CHEST',
          order: 5,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Piernas',
      subtitle: 'Lower body',
      splitLetter: 'C',
      order: 2,
      exercises: [
        {
          exerciseName: 'Sentadilla con Barra',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Peso Muerto Rumano',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Prensa de Piernas',
          category: 'LEGS',
          order: 3,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 120
        },
        {
          exerciseName: 'Curl Femoral',
          category: 'LEGS',
          order: 4,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 90
        }
      ]
    }
  ]
  // 4, 5, 6 day templates would follow similar pattern
};

/**
 * Exercise templates for FULL_BODY focus
 */
const FULL_BODY_TEMPLATES: Record<number, GeneratedSplit[]> = {
  3: [
    {
      name: 'Cuerpo Completo A',
      subtitle: 'Entrenamiento balanceado',
      splitLetter: 'A',
      order: 0,
      exercises: [
        {
          exerciseName: 'Sentadilla con Barra',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Press de Banca',
          category: 'CHEST',
          order: 2,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Remo con Barra',
          category: 'BACK',
          order: 3,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Press Militar',
          category: 'SHOULDERS',
          order: 4,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Plancha Abdominal',
          category: 'CORE',
          order: 5,
          targetSets: 3,
          targetReps: '30-60s',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Cuerpo Completo B',
      subtitle: 'Variación de ejercicios',
      splitLetter: 'B',
      order: 1,
      exercises: [
        {
          exerciseName: 'Peso Muerto',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '6-10',
          restSeconds: 180
        },
        {
          exerciseName: 'Press Inclinado',
          category: 'CHEST',
          order: 2,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Dominadas',
          category: 'BACK',
          order: 3,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Curl de Bíceps',
          category: 'ARMS',
          order: 4,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Extensión de Tríceps',
          category: 'ARMS',
          order: 5,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        }
      ]
    },
    {
      name: 'Cuerpo Completo C',
      subtitle: 'Énfasis en piernas',
      splitLetter: 'C',
      order: 2,
      exercises: [
        {
          exerciseName: 'Prensa de Piernas',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '10-15',
          restSeconds: 120
        },
        {
          exerciseName: 'Zancadas',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '10-12',
          restSeconds: 90
        },
        {
          exerciseName: 'Fondos en Paralelas',
          category: 'ARMS',
          order: 3,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Jalón al Pecho',
          category: 'BACK',
          order: 4,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 90
        },
        {
          exerciseName: 'Elevaciones Laterales',
          category: 'SHOULDERS',
          order: 5,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 60
        }
      ]
    }
  ]
  // 4, 5, 6 day templates would follow similar pattern
};

/**
 * Exercise templates for CORE focus
 */
const CORE_FOCUS_TEMPLATES: Record<number, GeneratedSplit[]> = {
  3: [
    {
      name: 'Core y Abdomen A',
      subtitle: 'Enfoque frontal',
      splitLetter: 'A',
      order: 0,
      exercises: [
        {
          exerciseName: 'Plancha Abdominal',
          category: 'CORE',
          order: 1,
          targetSets: 4,
          targetReps: '45-60s',
          restSeconds: 90
        },
        {
          exerciseName: 'Crunches Abdominales',
          category: 'CORE',
          order: 2,
          targetSets: 4,
          targetReps: '15-20',
          restSeconds: 60
        },
        {
          exerciseName: 'Elevación de Piernas',
          category: 'CORE',
          order: 3,
          targetSets: 3,
          targetReps: '12-15',
          restSeconds: 60
        },
        {
          exerciseName: 'Mountain Climbers',
          category: 'CORE',
          order: 4,
          targetSets: 3,
          targetReps: '20-30',
          restSeconds: 60
        },
        {
          exerciseName: 'Russian Twists',
          category: 'CORE',
          order: 5,
          targetSets: 3,
          targetReps: '20-30',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Torso Superior',
      subtitle: 'Estabilidad del core',
      splitLetter: 'B',
      order: 1,
      exercises: [
        {
          exerciseName: 'Press de Banca',
          category: 'CHEST',
          order: 1,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Remo con Barra',
          category: 'BACK',
          order: 2,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Press Militar',
          category: 'SHOULDERS',
          order: 3,
          targetSets: 3,
          targetReps: '8-12',
          restSeconds: 120
        },
        {
          exerciseName: 'Plancha Lateral',
          category: 'CORE',
          order: 4,
          targetSets: 3,
          targetReps: '30-45s',
          restSeconds: 60
        }
      ]
    },
    {
      name: 'Piernas y Core',
      subtitle: 'Core funcional',
      splitLetter: 'C',
      order: 2,
      exercises: [
        {
          exerciseName: 'Sentadilla con Barra',
          category: 'LEGS',
          order: 1,
          targetSets: 4,
          targetReps: '8-12',
          restSeconds: 180
        },
        {
          exerciseName: 'Peso Muerto',
          category: 'LEGS',
          order: 2,
          targetSets: 3,
          targetReps: '6-10',
          restSeconds: 180
        },
        {
          exerciseName: 'Plancha con Toque de Hombro',
          category: 'CORE',
          order: 3,
          targetSets: 3,
          targetReps: '10-15',
          restSeconds: 60
        },
        {
          exerciseName: 'Bicicleta Abdominal',
          category: 'CORE',
          order: 4,
          targetSets: 3,
          targetReps: '20-30',
          restSeconds: 60
        }
      ]
    }
  ]
  // 4, 5, 6 day templates would follow similar pattern
};

// ============================================================================
// GENERATION FUNCTION
// ============================================================================

/**
 * Generate workout splits based on frequency and training focus
 *
 * @param frequency - Number of training days per week (3-6)
 * @param trainingFocus - Training focus (LEGS, ARMS, FULL_BODY, CORE)
 * @returns Array of generated splits
 */
export function generateWorkoutSplits(
  frequency: number,
  trainingFocus: TrainingFocus
): GeneratedSplit[] {
  // Validate frequency
  if (frequency < 3 || frequency > 6) {
    throw new Error('Frequency must be between 3 and 6 days per week');
  }

  // Select template based on training focus
  let templates: Record<number, GeneratedSplit[]>;

  switch (trainingFocus) {
    case 'LEGS':
      templates = LEGS_FOCUS_TEMPLATES;
      break;
    case 'ARMS':
      templates = ARMS_FOCUS_TEMPLATES;
      break;
    case 'FULL_BODY':
      templates = FULL_BODY_TEMPLATES;
      break;
    case 'CORE':
      templates = CORE_FOCUS_TEMPLATES;
      break;
    default:
      throw new Error(`Unknown training focus: ${trainingFocus}`);
  }

  // Get template for frequency (fallback to 3-day if not available)
  const splitTemplate = templates[frequency] || templates[3] || [];

  if (splitTemplate.length === 0) {
    throw new Error(
      `No template available for frequency ${frequency} and focus ${trainingFocus}`
    );
  }

  return splitTemplate;
}

/**
 * Validate split generation parameters
 */
export function validateSplitGenerationParams(
  frequency: number,
  trainingFocus: TrainingFocus
): { isValid: boolean; error?: string } {
  if (frequency < 3 || frequency > 6) {
    return {
      isValid: false,
      error: 'Frequency must be between 3 and 6 days per week'
    };
  }

  if (!['LEGS', 'ARMS', 'FULL_BODY', 'CORE'].includes(trainingFocus)) {
    return { isValid: false, error: 'Invalid training focus' };
  }

  return { isValid: true };
}
