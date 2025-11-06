import { PrismaClient, ExerciseCategory } from '@prisma/client';

const prisma = new PrismaClient();

const predefinedExercises = [
  // CHEST Exercises
  {
    name: 'Bench Press',
    category: ExerciseCategory.CHEST,
    description: 'Barbell bench press on flat bench',
    isPredefined: true,
  },
  {
    name: 'Incline Bench Press',
    category: ExerciseCategory.CHEST,
    description: 'Barbell bench press on incline bench (30-45 degrees)',
    isPredefined: true,
  },
  {
    name: 'Decline Bench Press',
    category: ExerciseCategory.CHEST,
    description: 'Barbell bench press on decline bench',
    isPredefined: true,
  },
  {
    name: 'Dumbbell Bench Press',
    category: ExerciseCategory.CHEST,
    description: 'Dumbbell bench press on flat bench',
    isPredefined: true,
  },
  {
    name: 'Incline Dumbbell Press',
    category: ExerciseCategory.CHEST,
    description: 'Dumbbell press on incline bench',
    isPredefined: true,
  },
  {
    name: 'Dumbbell Flyes',
    category: ExerciseCategory.CHEST,
    description: 'Dumbbell chest flyes on flat bench',
    isPredefined: true,
  },
  {
    name: 'Cable Flyes',
    category: ExerciseCategory.CHEST,
    description: 'Cable chest flyes (high, mid, or low position)',
    isPredefined: true,
  },
  {
    name: 'Push-Ups',
    category: ExerciseCategory.CHEST,
    description: 'Standard push-ups (bodyweight)',
    isPredefined: true,
  },
  {
    name: 'Chest Dips',
    category: ExerciseCategory.CHEST,
    description: 'Dips with forward lean for chest emphasis',
    isPredefined: true,
  },

  // BACK Exercises
  {
    name: 'Deadlift',
    category: ExerciseCategory.BACK,
    description: 'Conventional barbell deadlift',
    isPredefined: true,
  },
  {
    name: 'Barbell Row',
    category: ExerciseCategory.BACK,
    description: 'Bent-over barbell row',
    isPredefined: true,
  },
  {
    name: 'T-Bar Row',
    category: ExerciseCategory.BACK,
    description: 'T-bar row with close grip',
    isPredefined: true,
  },
  {
    name: 'Dumbbell Row',
    category: ExerciseCategory.BACK,
    description: 'Single-arm dumbbell row',
    isPredefined: true,
  },
  {
    name: 'Seated Cable Row',
    category: ExerciseCategory.BACK,
    description: 'Seated cable row (narrow or wide grip)',
    isPredefined: true,
  },
  {
    name: 'Lat Pulldown',
    category: ExerciseCategory.BACK,
    description: 'Lat pulldown with wide grip',
    isPredefined: true,
  },
  {
    name: 'Pull-Ups',
    category: ExerciseCategory.BACK,
    description: 'Standard pull-ups (bodyweight)',
    isPredefined: true,
  },
  {
    name: 'Chin-Ups',
    category: ExerciseCategory.BACK,
    description: 'Chin-ups with supinated grip',
    isPredefined: true,
  },
  {
    name: 'Face Pulls',
    category: ExerciseCategory.BACK,
    description: 'Cable face pulls for rear delts and upper back',
    isPredefined: true,
  },
  {
    name: 'Hyperextensions',
    category: ExerciseCategory.BACK,
    description: 'Lower back hyperextensions',
    isPredefined: true,
  },

  // LEGS Exercises
  {
    name: 'Squat',
    category: ExerciseCategory.LEGS,
    description: 'Barbell back squat',
    isPredefined: true,
  },
  {
    name: 'Front Squat',
    category: ExerciseCategory.LEGS,
    description: 'Barbell front squat',
    isPredefined: true,
  },
  {
    name: 'Leg Press',
    category: ExerciseCategory.LEGS,
    description: 'Machine leg press',
    isPredefined: true,
  },
  {
    name: 'Romanian Deadlift',
    category: ExerciseCategory.LEGS,
    description: 'Romanian deadlift for hamstrings',
    isPredefined: true,
  },
  {
    name: 'Leg Curl',
    category: ExerciseCategory.LEGS,
    description: 'Machine leg curl (lying or seated)',
    isPredefined: true,
  },
  {
    name: 'Leg Extension',
    category: ExerciseCategory.LEGS,
    description: 'Machine leg extension',
    isPredefined: true,
  },
  {
    name: 'Lunges',
    category: ExerciseCategory.LEGS,
    description: 'Walking or stationary lunges',
    isPredefined: true,
  },
  {
    name: 'Bulgarian Split Squat',
    category: ExerciseCategory.LEGS,
    description: 'Single-leg split squat with rear foot elevated',
    isPredefined: true,
  },
  {
    name: 'Calf Raises',
    category: ExerciseCategory.LEGS,
    description: 'Standing or seated calf raises',
    isPredefined: true,
  },
  {
    name: 'Goblet Squat',
    category: ExerciseCategory.LEGS,
    description: 'Dumbbell or kettlebell goblet squat',
    isPredefined: true,
  },

  // SHOULDERS Exercises
  {
    name: 'Overhead Press',
    category: ExerciseCategory.SHOULDERS,
    description: 'Barbell overhead press (standing or seated)',
    isPredefined: true,
  },
  {
    name: 'Dumbbell Shoulder Press',
    category: ExerciseCategory.SHOULDERS,
    description: 'Seated dumbbell shoulder press',
    isPredefined: true,
  },
  {
    name: 'Arnold Press',
    category: ExerciseCategory.SHOULDERS,
    description: 'Arnold Schwarzenegger press with rotation',
    isPredefined: true,
  },
  {
    name: 'Lateral Raises',
    category: ExerciseCategory.SHOULDERS,
    description: 'Dumbbell lateral raises for side delts',
    isPredefined: true,
  },
  {
    name: 'Front Raises',
    category: ExerciseCategory.SHOULDERS,
    description: 'Dumbbell or barbell front raises',
    isPredefined: true,
  },
  {
    name: 'Rear Delt Flyes',
    category: ExerciseCategory.SHOULDERS,
    description: 'Bent-over rear delt flyes',
    isPredefined: true,
  },
  {
    name: 'Upright Row',
    category: ExerciseCategory.SHOULDERS,
    description: 'Barbell or cable upright row',
    isPredefined: true,
  },
  {
    name: 'Shrugs',
    category: ExerciseCategory.SHOULDERS,
    description: 'Barbell or dumbbell shrugs for traps',
    isPredefined: true,
  },

  // ARMS Exercises
  {
    name: 'Barbell Curl',
    category: ExerciseCategory.ARMS,
    description: 'Standing barbell bicep curl',
    isPredefined: true,
  },
  {
    name: 'Dumbbell Curl',
    category: ExerciseCategory.ARMS,
    description: 'Alternating or simultaneous dumbbell curls',
    isPredefined: true,
  },
  {
    name: 'Hammer Curl',
    category: ExerciseCategory.ARMS,
    description: 'Neutral grip dumbbell curls',
    isPredefined: true,
  },
  {
    name: 'Preacher Curl',
    category: ExerciseCategory.ARMS,
    description: 'Preacher bench barbell or dumbbell curl',
    isPredefined: true,
  },
  {
    name: 'Cable Curl',
    category: ExerciseCategory.ARMS,
    description: 'Cable bicep curls',
    isPredefined: true,
  },
  {
    name: 'Close-Grip Bench Press',
    category: ExerciseCategory.ARMS,
    description: 'Barbell close-grip bench press for triceps',
    isPredefined: true,
  },
  {
    name: 'Tricep Dips',
    category: ExerciseCategory.ARMS,
    description: 'Tricep dips on parallel bars or bench',
    isPredefined: true,
  },
  {
    name: 'Skull Crushers',
    category: ExerciseCategory.ARMS,
    description: 'Lying tricep extensions (skull crushers)',
    isPredefined: true,
  },
  {
    name: 'Tricep Pushdown',
    category: ExerciseCategory.ARMS,
    description: 'Cable tricep pushdown (rope or bar)',
    isPredefined: true,
  },
  {
    name: 'Overhead Tricep Extension',
    category: ExerciseCategory.ARMS,
    description: 'Dumbbell or cable overhead tricep extension',
    isPredefined: true,
  },

  // CORE Exercises
  {
    name: 'Plank',
    category: ExerciseCategory.CORE,
    description: 'Standard front plank hold',
    isPredefined: true,
  },
  {
    name: 'Side Plank',
    category: ExerciseCategory.CORE,
    description: 'Side plank hold',
    isPredefined: true,
  },
  {
    name: 'Crunches',
    category: ExerciseCategory.CORE,
    description: 'Standard abdominal crunches',
    isPredefined: true,
  },
  {
    name: 'Russian Twists',
    category: ExerciseCategory.CORE,
    description: 'Seated Russian twists',
    isPredefined: true,
  },
  {
    name: 'Leg Raises',
    category: ExerciseCategory.CORE,
    description: 'Hanging or lying leg raises',
    isPredefined: true,
  },
  {
    name: 'Cable Woodchoppers',
    category: ExerciseCategory.CORE,
    description: 'Cable woodchopper rotations',
    isPredefined: true,
  },
  {
    name: 'Ab Wheel Rollout',
    category: ExerciseCategory.CORE,
    description: 'Ab wheel rollout from knees or feet',
    isPredefined: true,
  },

  // CARDIO Exercises
  {
    name: 'Running',
    category: ExerciseCategory.CARDIO,
    description: 'Treadmill or outdoor running',
    isPredefined: true,
  },
  {
    name: 'Cycling',
    category: ExerciseCategory.CARDIO,
    description: 'Stationary bike or outdoor cycling',
    isPredefined: true,
  },
  {
    name: 'Rowing',
    category: ExerciseCategory.CARDIO,
    description: 'Rowing machine',
    isPredefined: true,
  },
  {
    name: 'Jump Rope',
    category: ExerciseCategory.CARDIO,
    description: 'Jump rope cardio',
    isPredefined: true,
  },
  {
    name: 'Burpees',
    category: ExerciseCategory.CARDIO,
    description: 'Full-body burpee exercise',
    isPredefined: true,
  },
  {
    name: 'Elliptical',
    category: ExerciseCategory.CARDIO,
    description: 'Elliptical machine',
    isPredefined: true,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing predefined exercises (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Clearing existing predefined exercises...');
    await prisma.exercise.deleteMany({
      where: { isPredefined: true },
    });
  }

  // Seed predefined exercises
  console.log('📦 Seeding predefined exercises...');
  for (const exercise of predefinedExercises) {
    await prisma.exercise.create({
      data: exercise,
    });
  }

  console.log(`✅ Seeded ${predefinedExercises.length} predefined exercises`);

  // Summary by category
  const summary = await prisma.exercise.groupBy({
    by: ['category'],
    where: { isPredefined: true },
    _count: { id: true },
  });

  console.log('\n📊 Exercises by category:');
  summary.forEach(({ category, _count }) => {
    console.log(`   ${category}: ${_count.id} exercises`);
  });

  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
