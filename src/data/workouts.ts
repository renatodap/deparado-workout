import { WorkoutPlan, Quote } from '../types';
import { exercises } from './exercises';

const getExercise = (id: string) => {
  const exercise = exercises.find(ex => ex.id === id);
  if (!exercise) throw new Error(`Exercise not found: ${id}`);
  return exercise;
};

export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'treino-a',
    name: 'Treino A - Superior e Inferior',
    shortName: 'Treino A',
    dayOfWeek: 'Terça-feira',
    isOptional: false,
    description: 'Foco em peito, costas, bíceps, pernas e abdômen',
    exercises: [
      getExercise('crucifixo-maquina'),
      getExercise('leg-press'),
      getExercise('abdominal-maquina'),
      getExercise('remada-maquina'),
      getExercise('extensora'),
      getExercise('rosca-biceps')
    ]
  },
  {
    id: 'treino-b',
    name: 'Treino B - Superior e Inferior',
    shortName: 'Treino B',
    dayOfWeek: 'Quinta-feira',
    isOptional: false,
    description: 'Foco em ombros, costas, tríceps, posterior e abdômen',
    exercises: [
      getExercise('desenvolvimento-maquina'),
      getExercise('flexora-sentada'),
      getExercise('rotacao-tronco'),
      getExercise('puxada-frontal'),
      getExercise('adutora-abdutora'),
      getExercise('triceps-maquina')
    ]
  },
  {
    id: 'treino-c',
    name: 'Treino C - Full Body Leve',
    shortName: 'Treino C',
    dayOfWeek: 'Sábado',
    isOptional: true,
    description: 'Treino leve e opcional para manter a consistência',
    exercises: [
      getExercise('supino-maquina-leve'),
      getExercise('leg-press-leve'),
      getExercise('prancha'),
      getExercise('remada-halter'),
      getExercise('panturrilha-pe'),
      getExercise('elevacao-lateral')
    ]
  }
];

export const getWorkoutPlanById = (id: string): WorkoutPlan | undefined => {
  return workoutPlans.find(wp => wp.id === id);
};

export const getTodayWorkout = (): WorkoutPlan | null => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  switch (dayOfWeek) {
    case 2: // Terça
      return workoutPlans.find(wp => wp.id === 'treino-a') || null;
    case 4: // Quinta
      return workoutPlans.find(wp => wp.id === 'treino-b') || null;
    case 6: // Sábado
      return workoutPlans.find(wp => wp.id === 'treino-c') || null;
    default:
      return null;
  }
};

export const getNextWorkout = (): { workout: WorkoutPlan; daysUntil: number } => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Dias de treino: 2 (Terça), 4 (Quinta), 6 (Sábado)
  const workoutDays = [2, 4, 6];

  let daysUntil = 0;
  let nextDay = dayOfWeek;

  // Encontrar o próximo dia de treino
  do {
    nextDay = (nextDay + 1) % 7;
    daysUntil++;
  } while (!workoutDays.includes(nextDay) && daysUntil < 7);

  // Se já é dia de treino, verificar se é hoje
  if (workoutDays.includes(dayOfWeek)) {
    daysUntil = 0;
    nextDay = dayOfWeek;
  }

  let workout: WorkoutPlan;
  switch (nextDay) {
    case 2:
      workout = workoutPlans.find(wp => wp.id === 'treino-a')!;
      break;
    case 4:
      workout = workoutPlans.find(wp => wp.id === 'treino-b')!;
      break;
    case 6:
      workout = workoutPlans.find(wp => wp.id === 'treino-c')!;
      break;
    default:
      workout = workoutPlans[0];
  }

  return { workout, daysUntil };
};

export const motivationalQuotes: Quote[] = [
  { text: 'Cada treino te deixa mais forte!', emoji: '💪' },
  { text: 'Você está investindo na sua saúde!', emoji: '❤️' },
  { text: 'Força e determinação, Daniela!', emoji: '🌟' },
  { text: 'Seu corpo agradece esse cuidado!', emoji: '🙏' },
  { text: 'Mais um passo em direção aos seus objetivos!', emoji: '🎯' },
  { text: 'Você é mais forte do que imagina!', emoji: '💪' },
  { text: 'Consistência é o segredo! Continue assim!', emoji: '🔥' },
  { text: 'Seu eu do futuro agradece o treino de hoje!', emoji: '✨' },
  { text: 'Cada dia é uma nova oportunidade de evoluir!', emoji: '🌅' },
  { text: 'O suor de hoje é a conquista de amanhã!', emoji: '🏆' },
  { text: 'Você está construindo uma versão mais forte de si mesma!', emoji: '💎' },
  { text: 'A jornada de mil quilômetros começa com um passo!', emoji: '👟' },
];

export const getRandomQuote = (): Quote => {
  const index = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[index];
};

export const completionMessages = [
  'Treino completo! Você arrasou! 🎉',
  'Parabéns! Mais um treino na conta!',
  'Incrível! Você está ficando cada vez mais forte!',
  'Excelente trabalho, Daniela! Você é demais!',
  'Missão cumprida! Seu corpo agradece!'
];

export const getRandomCompletionMessage = (): string => {
  const index = Math.floor(Math.random() * completionMessages.length);
  return completionMessages[index];
};

export const getDayName = (dayOfWeek: number): string => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[dayOfWeek];
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
