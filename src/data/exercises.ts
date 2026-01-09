import { Exercise } from '../types';

export const exercises: Exercise[] = [
  // TREINO A - Terça-feira
  {
    id: 'crucifixo-maquina',
    name: 'Crucifixo Máquina',
    muscleGroup: 'superior',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina com as costas bem apoiadas. Segure as alças com os cotovelos levemente flexionados. Aproxime as alças à frente do peito, contraindo o peitoral. Retorne lentamente à posição inicial.',
    tips: [
      'Mantenha os ombros relaxados, longe das orelhas',
      'Não deixe os cotovelos ficarem totalmente esticados',
      'Respire: expire ao aproximar, inspire ao afastar'
    ],
    easySubstitute: {
      name: 'Supino Máquina (Chest Press)',
      instructions: 'Sente-se na máquina com as costas apoiadas. Empurre as alças à frente até quase esticar os braços. Retorne controladamente.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 10
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroup: 'inferior',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina com as costas bem apoiadas. Posicione os pés na plataforma na largura dos ombros. Empurre a plataforma esticando as pernas (sem travar os joelhos). Retorne flexionando os joelhos.',
    tips: [
      'Mantenha os pés paralelos na plataforma',
      'Não trave os joelhos ao esticar',
      'Desça até os joelhos formarem 90 graus'
    ],
    easySubstitute: {
      name: 'Agachamento Cadeira',
      instructions: 'Fique de pé em frente a uma cadeira. Agache como se fosse sentar, tocando levemente o assento, e levante-se novamente.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 30
  },
  {
    id: 'abdominal-maquina',
    name: 'Abdominal Máquina',
    muscleGroup: 'abdomen',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina e segure as alças. Flexione o tronco para frente contraindo o abdômen. Retorne lentamente à posição inicial.',
    tips: [
      'Foque na contração do abdômen, não nos braços',
      'Movimento controlado, sem pressa',
      'Expire ao contrair, inspire ao voltar'
    ],
    easySubstitute: {
      name: 'Prancha',
      instructions: 'Apoie os antebraços e as pontas dos pés no chão. Mantenha o corpo reto como uma prancha por 30 segundos.'
    },
    defaultSets: 2,
    defaultReps: '15-20',
    suggestedStartWeight: 15
  },
  {
    id: 'remada-maquina',
    name: 'Remada Máquina (Seated Row)',
    muscleGroup: 'superior',
    equipment: 'Life Fitness',
    instructions: 'Sente-se com o peito apoiado no suporte. Puxe as alças em direção ao abdômen, aproximando as escápulas. Retorne controladamente.',
    tips: [
      'Puxe os cotovelos para trás, não para cima',
      'Aperte as costas no final do movimento',
      'Mantenha os ombros baixos'
    ],
    easySubstitute: {
      name: 'Remada com Halter Apoiada',
      instructions: 'Apoie uma mão e um joelho em um banco. Com a outra mão, puxe o halter em direção ao quadril.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 15
  },
  {
    id: 'extensora',
    name: 'Extensora (Leg Extension)',
    muscleGroup: 'inferior',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina com as costas apoiadas. Posicione os tornozelos sob o rolo. Estique as pernas até a posição reta. Retorne controladamente.',
    tips: [
      'Não balance o tronco para ajudar',
      'Mantenha o movimento lento e controlado',
      'Aperte a coxa no topo do movimento'
    ],
    easySubstitute: {
      name: 'Extensão de Perna Sentada',
      instructions: 'Sentada em uma cadeira, estique uma perna de cada vez, segurando por 2 segundos no topo.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 15
  },
  {
    id: 'rosca-biceps',
    name: 'Rosca Bíceps com Halteres',
    muscleGroup: 'superior',
    equipment: 'Halteres',
    instructions: 'Em pé, segure um halter em cada mão com os braços estendidos. Flexione os cotovelos trazendo os halteres em direção aos ombros. Desça controladamente.',
    tips: [
      'Mantenha os cotovelos junto ao corpo',
      'Não balance o tronco para ajudar',
      'Movimento controlado na descida'
    ],
    easySubstitute: {
      name: 'Rosca com Garrafa de Água',
      instructions: 'Use garrafas de água de 500ml ou 1L como peso. Faça o mesmo movimento da rosca bíceps.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 3
  },

  // TREINO B - Quinta-feira
  {
    id: 'desenvolvimento-maquina',
    name: 'Desenvolvimento Máquina (Shoulder Press)',
    muscleGroup: 'superior',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina com as costas apoiadas. Empurre as alças para cima até quase esticar os braços. Retorne controladamente.',
    tips: [
      'Não arquee as costas',
      'Mantenha o core contraído',
      'Não trave os cotovelos no topo'
    ],
    easySubstitute: {
      name: 'Elevação Lateral Leve',
      instructions: 'Em pé, com halteres leves, eleve os braços lateralmente até a altura dos ombros. Desça controladamente.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 8
  },
  {
    id: 'flexora-sentada',
    name: 'Flexora Sentada (Leg Curl)',
    muscleGroup: 'inferior',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina com as costas apoiadas. Posicione os tornozelos sobre o rolo. Flexione os joelhos trazendo os calcanhares em direção aos glúteos. Retorne controladamente.',
    tips: [
      'Não levante o quadril do banco',
      'Concentre-se na posterior da coxa',
      'Movimento lento e controlado'
    ],
    easySubstitute: {
      name: 'Ponte de Glúteos',
      instructions: 'Deite de costas com os joelhos flexionados. Eleve o quadril até formar uma linha reta dos ombros aos joelhos. Desça controladamente.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 15
  },
  {
    id: 'rotacao-tronco',
    name: 'Rotação de Tronco Máquina',
    muscleGroup: 'abdomen',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina e segure as alças. Gire o tronco para um lado, depois para o outro, de forma controlada.',
    tips: [
      'Mantenha o quadril fixo no banco',
      'O movimento vem do core, não dos braços',
      'Gire apenas o quanto for confortável'
    ],
    easySubstitute: {
      name: 'Rotação Sentada sem Peso',
      instructions: 'Sentada em uma cadeira, cruze os braços sobre o peito e gire o tronco de um lado para o outro.'
    },
    defaultSets: 2,
    defaultReps: '15-20',
    suggestedStartWeight: 10
  },
  {
    id: 'puxada-frontal',
    name: 'Puxada Frontal (Lat Pulldown)',
    muscleGroup: 'superior',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina e segure a barra larga. Puxe a barra em direção ao peito, aproximando as escápulas. Retorne controladamente.',
    tips: [
      'Puxe os cotovelos para baixo e para trás',
      'Não incline muito o tronco para trás',
      'Mantenha o peito erguido'
    ],
    easySubstitute: {
      name: 'Puxada com Banda Elástica',
      instructions: 'Prenda uma banda elástica em um ponto alto. Puxe a banda em direção ao peito, imitando o movimento da puxada.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 20
  },
  {
    id: 'adutora-abdutora',
    name: 'Adutora/Abdutora',
    muscleGroup: 'inferior',
    equipment: 'Life Fitness',
    instructions: 'Para Adutora: sente-se e junte as pernas contra a resistência. Para Abdutora: sente-se e afaste as pernas contra a resistência.',
    tips: [
      'Movimento controlado, sem impulso',
      'Mantenha as costas apoiadas',
      'Faça os dois exercícios ou alterne a cada treino'
    ],
    easySubstitute: {
      name: 'Elevação Lateral de Perna',
      instructions: 'Deitada de lado, eleve a perna de cima mantendo-a esticada. Desça controladamente.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 20
  },
  {
    id: 'triceps-maquina',
    name: 'Tríceps Máquina ou Halter',
    muscleGroup: 'superior',
    equipment: 'Life Fitness/Halteres',
    instructions: 'Na máquina: empurre a barra para baixo esticando os cotovelos. Com halter: segure com as duas mãos atrás da cabeça e estique os braços para cima.',
    tips: [
      'Mantenha os cotovelos fixos',
      'Não use impulso do corpo',
      'Concentre-se na contração do tríceps'
    ],
    easySubstitute: {
      name: 'Tríceps na Cadeira',
      instructions: 'Apoie as mãos na borda de uma cadeira, com os pés à frente. Desça o corpo flexionando os cotovelos e suba novamente.'
    },
    defaultSets: 3,
    defaultReps: '12-15',
    suggestedStartWeight: 10
  },

  // TREINO C - Sábado (Full Body Leve)
  {
    id: 'supino-maquina-leve',
    name: 'Supino Máquina (leve)',
    muscleGroup: 'superior',
    equipment: 'Life Fitness',
    instructions: 'Sente-se na máquina com as costas apoiadas. Empurre as alças à frente até quase esticar os braços. Retorne controladamente. Use peso mais leve que o normal.',
    tips: [
      'Foco na técnica, não no peso',
      'Movimento fluido e controlado',
      'Respire naturalmente'
    ],
    easySubstitute: {
      name: 'Flexão Inclinada',
      instructions: 'Apoie as mãos em uma superfície elevada (banco, parede). Faça flexões nessa posição inclinada.'
    },
    defaultSets: 2,
    defaultReps: '15',
    suggestedStartWeight: 8
  },
  {
    id: 'leg-press-leve',
    name: 'Leg Press (leve)',
    muscleGroup: 'inferior',
    equipment: 'Life Fitness',
    instructions: 'Mesmo movimento do Leg Press regular, mas com peso reduzido. Foco em amplitude e técnica.',
    tips: [
      'Use 50-70% do peso normal',
      'Foco na técnica perfeita',
      'Aproveite para trabalhar amplitude'
    ],
    easySubstitute: {
      name: 'Agachamento Livre',
      instructions: 'Em pé, agache até as coxas ficarem paralelas ao chão. Suba controladamente.'
    },
    defaultSets: 2,
    defaultReps: '15',
    suggestedStartWeight: 20
  },
  {
    id: 'prancha',
    name: 'Prancha',
    muscleGroup: 'abdomen',
    equipment: 'Chão',
    instructions: 'Apoie os antebraços e as pontas dos pés no chão. Mantenha o corpo reto, como uma tábua, contraindo o abdômen.',
    tips: [
      'Não deixe o quadril subir ou descer',
      'Olhe para o chão, pescoço neutro',
      'Respire normalmente durante a prancha'
    ],
    easySubstitute: {
      name: 'Prancha nos Joelhos',
      instructions: 'Faça a prancha apoiando os joelhos no chão em vez das pontas dos pés.'
    },
    defaultSets: 2,
    defaultReps: '30-45s',
    suggestedStartWeight: 0
  },
  {
    id: 'remada-halter',
    name: 'Remada com Halter',
    muscleGroup: 'superior',
    equipment: 'Halteres',
    instructions: 'Apoie uma mão e um joelho em um banco. Com a outra mão, puxe o halter em direção ao quadril, aproximando a escápula.',
    tips: [
      'Mantenha as costas retas',
      'Puxe o cotovelo para trás, não para cima',
      'Alterne os lados'
    ],
    easySubstitute: {
      name: 'Remada com Garrafa',
      instructions: 'Use uma garrafa de água como peso. Faça o mesmo movimento da remada.'
    },
    defaultSets: 2,
    defaultReps: '15',
    suggestedStartWeight: 4
  },
  {
    id: 'panturrilha-pe',
    name: 'Panturrilha em Pé',
    muscleGroup: 'inferior',
    equipment: 'Livre',
    instructions: 'Em pé, eleve os calcanhares ficando na ponta dos pés. Desça controladamente.',
    tips: [
      'Apoie-se em algo para equilíbrio se necessário',
      'Suba o máximo que conseguir',
      'Movimento lento e controlado'
    ],
    easySubstitute: {
      name: 'Elevação na Escada',
      instructions: 'Fique na borda de um degrau e faça elevações de panturrilha.'
    },
    defaultSets: 2,
    defaultReps: '15-20',
    suggestedStartWeight: 0
  },
  {
    id: 'elevacao-lateral',
    name: 'Elevação Lateral',
    muscleGroup: 'superior',
    equipment: 'Halteres',
    instructions: 'Em pé, com halteres nas mãos, eleve os braços lateralmente até a altura dos ombros. Desça controladamente.',
    tips: [
      'Cotovelos levemente flexionados',
      'Não balance o corpo',
      'Palmas das mãos voltadas para baixo'
    ],
    easySubstitute: {
      name: 'Elevação sem Peso',
      instructions: 'Faça o mesmo movimento sem halteres, focando na contração muscular.'
    },
    defaultSets: 2,
    defaultReps: '15',
    suggestedStartWeight: 2
  }
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(ex => ex.id === id);
};

export const getExercisesByMuscleGroup = (group: string): Exercise[] => {
  return exercises.filter(ex => ex.muscleGroup === group);
};
