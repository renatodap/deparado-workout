import { MealItem, MealItemCategory, MealType } from '../types';

// Helper to create meal items with consistent structure
const createItem = (
  id: string,
  name: string,
  category: MealItemCategory,
  servingSize: number,
  servingUnit: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  fiber?: number
): MealItem => ({
  id,
  name,
  category,
  servingSize,
  servingUnit,
  macrosPerServing: { calories, protein, carbs, fat, fiber },
  isCustom: false,
  createdAt: '2024-01-01T00:00:00Z',
  source: 'seed'
});

// ==========================================
// SEEDED BRAZILIAN FOOD DATABASE
// Based on TBCA (Tabela Brasileira de Composição de Alimentos)
// ==========================================

export const SEED_MEAL_ITEMS: MealItem[] = [
  // ==========================================
  // PROTEÍNAS (Proteins)
  // ==========================================
  createItem('prot_frango_grelhado', 'Frango grelhado (peito)', 'proteinas', 100, 'g', 159, 32, 0, 3),
  createItem('prot_frango_desfiado', 'Frango desfiado', 'proteinas', 100, 'g', 163, 31, 0, 4),
  createItem('prot_carne_bovina_grelhada', 'Carne bovina grelhada', 'proteinas', 100, 'g', 219, 26, 0, 12),
  createItem('prot_carne_moida', 'Carne moída refogada', 'proteinas', 100, 'g', 212, 24, 2, 12),
  createItem('prot_peixe_grelhado', 'Peixe grelhado (tilápia)', 'proteinas', 100, 'g', 128, 26, 0, 3),
  createItem('prot_salmao', 'Salmão grelhado', 'proteinas', 100, 'g', 208, 20, 0, 13),
  createItem('prot_ovo_inteiro', 'Ovo inteiro cozido', 'proteinas', 50, 'unidade', 78, 6, 1, 5),
  createItem('prot_ovo_mexido', 'Ovo mexido', 'proteinas', 60, 'unidade', 91, 6, 1, 7),
  createItem('prot_ovo_frito', 'Ovo frito', 'proteinas', 60, 'unidade', 120, 6, 1, 10),
  createItem('prot_clara_ovo', 'Clara de ovo', 'proteinas', 33, 'unidade', 17, 4, 0, 0),
  createItem('prot_atum_lata', 'Atum em lata (escorrido)', 'proteinas', 60, 'porção', 70, 15, 0, 1),
  createItem('prot_sardinha', 'Sardinha em lata', 'proteinas', 60, 'porção', 118, 14, 0, 7),
  createItem('prot_carne_porco', 'Carne de porco grelhada', 'proteinas', 100, 'g', 242, 27, 0, 14),
  createItem('prot_linguica', 'Linguiça grelhada', 'proteinas', 50, 'unidade', 145, 8, 1, 12),
  createItem('prot_presunto', 'Presunto', 'proteinas', 30, 'fatia', 35, 5, 1, 1),
  createItem('prot_peito_peru', 'Peito de peru', 'proteinas', 30, 'fatia', 29, 6, 0, 0.5),

  // ==========================================
  // CARBOIDRATOS (Carbs)
  // ==========================================
  createItem('carb_arroz_branco', 'Arroz branco cozido', 'carboidratos', 100, 'g', 128, 3, 28, 0, 0.4),
  createItem('carb_arroz_integral', 'Arroz integral cozido', 'carboidratos', 100, 'g', 124, 3, 26, 1, 1.8),
  createItem('carb_feijao_preto', 'Feijão preto cozido', 'carboidratos', 80, 'concha', 77, 5, 14, 0.5, 5),
  createItem('carb_feijao_carioca', 'Feijão carioca cozido', 'carboidratos', 80, 'concha', 76, 5, 14, 0.5, 5),
  createItem('carb_pao_frances', 'Pão francês', 'carboidratos', 50, 'unidade', 150, 5, 29, 2, 1),
  createItem('carb_pao_integral', 'Pão integral', 'carboidratos', 40, 'fatia', 90, 4, 16, 1, 2),
  createItem('carb_pao_forma', 'Pão de forma', 'carboidratos', 25, 'fatia', 62, 2, 12, 1, 0.5),
  createItem('carb_tapioca', 'Tapioca (goma hidratada)', 'carboidratos', 50, 'porção', 68, 0, 17, 0, 0),
  createItem('carb_cuscuz', 'Cuscuz de milho', 'carboidratos', 100, 'g', 112, 2, 25, 0, 1),
  createItem('carb_macarrao', 'Macarrão cozido', 'carboidratos', 100, 'g', 158, 5, 31, 1, 1.8),
  createItem('carb_macarrao_integral', 'Macarrão integral cozido', 'carboidratos', 100, 'g', 124, 5, 25, 1, 3),
  createItem('carb_batata_cozida', 'Batata cozida', 'carboidratos', 100, 'g', 87, 2, 20, 0, 1.8),
  createItem('carb_batata_doce', 'Batata doce cozida', 'carboidratos', 100, 'g', 77, 1, 18, 0, 2.5),
  createItem('carb_mandioca', 'Mandioca cozida', 'carboidratos', 100, 'g', 125, 1, 30, 0, 1.8),
  createItem('carb_aveia', 'Aveia em flocos', 'carboidratos', 30, 'colher de sopa', 117, 4, 20, 2, 3),
  createItem('carb_granola', 'Granola', 'carboidratos', 40, 'porção', 176, 4, 28, 6, 3),
  createItem('carb_farofa', 'Farofa', 'carboidratos', 30, 'colher de sopa', 93, 1, 13, 4, 1),
  createItem('carb_milho_cozido', 'Milho cozido', 'carboidratos', 100, 'g', 96, 3, 21, 1, 2),

  // ==========================================
  // VEGETAIS (Vegetables)
  // ==========================================
  createItem('veg_alface', 'Alface', 'vegetais', 30, 'folhas', 4, 0.4, 0.7, 0, 0.4),
  createItem('veg_tomate', 'Tomate', 'vegetais', 100, 'g', 18, 1, 4, 0, 1.2),
  createItem('veg_pepino', 'Pepino', 'vegetais', 100, 'g', 15, 0.7, 3, 0, 0.5),
  createItem('veg_cenoura', 'Cenoura crua', 'vegetais', 80, 'unidade', 34, 0.8, 8, 0, 2),
  createItem('veg_cenoura_cozida', 'Cenoura cozida', 'vegetais', 80, 'porção', 28, 0.6, 7, 0, 2),
  createItem('veg_brocolis', 'Brócolis cozido', 'vegetais', 100, 'g', 35, 3, 7, 0, 3),
  createItem('veg_couve', 'Couve refogada', 'vegetais', 60, 'porção', 25, 2, 3, 1, 2),
  createItem('veg_espinafre', 'Espinafre cozido', 'vegetais', 100, 'g', 23, 3, 4, 0, 2),
  createItem('veg_abobrinha', 'Abobrinha refogada', 'vegetais', 100, 'g', 22, 1, 4, 0.5, 1),
  createItem('veg_berinjela', 'Berinjela refogada', 'vegetais', 100, 'g', 35, 1, 6, 1, 3),
  createItem('veg_chuchu', 'Chuchu cozido', 'vegetais', 100, 'g', 17, 0.5, 4, 0, 1),
  createItem('veg_beterraba', 'Beterraba cozida', 'vegetais', 100, 'g', 44, 2, 10, 0, 2),
  createItem('veg_repolho', 'Repolho cru', 'vegetais', 50, 'porção', 13, 0.6, 3, 0, 1),
  createItem('veg_vagem', 'Vagem cozida', 'vegetais', 100, 'g', 25, 1.5, 5, 0, 3),
  createItem('veg_quiabo', 'Quiabo refogado', 'vegetais', 100, 'g', 33, 2, 7, 0, 3),
  createItem('veg_abobora', 'Abóbora cozida', 'vegetais', 100, 'g', 26, 1, 6, 0, 2),
  createItem('veg_salada_mista', 'Salada mista', 'vegetais', 100, 'g', 20, 1, 4, 0, 2),
  createItem('veg_rucula', 'Rúcula', 'vegetais', 20, 'porção', 5, 0.5, 0.7, 0, 0.3),

  // ==========================================
  // FRUTAS (Fruits)
  // ==========================================
  createItem('frut_banana', 'Banana prata', 'frutas', 90, 'unidade', 89, 1, 23, 0, 2),
  createItem('frut_maca', 'Maçã', 'frutas', 150, 'unidade', 78, 0, 21, 0, 3),
  createItem('frut_laranja', 'Laranja', 'frutas', 180, 'unidade', 62, 1, 15, 0, 3),
  createItem('frut_mamao', 'Mamão papaia', 'frutas', 150, 'fatia', 60, 0.6, 15, 0, 2.5),
  createItem('frut_melancia', 'Melancia', 'frutas', 200, 'fatia', 62, 1, 16, 0, 0.8),
  createItem('frut_manga', 'Manga', 'frutas', 140, 'unidade', 84, 0.8, 22, 0, 2),
  createItem('frut_abacaxi', 'Abacaxi', 'frutas', 100, 'fatia', 48, 0.5, 12, 0, 1),
  createItem('frut_morango', 'Morango', 'frutas', 100, 'g', 32, 0.7, 8, 0, 2),
  createItem('frut_uva', 'Uva', 'frutas', 100, 'g', 69, 0.7, 18, 0, 0.9),
  createItem('frut_pera', 'Pera', 'frutas', 180, 'unidade', 103, 0.6, 27, 0, 5),
  createItem('frut_goiaba', 'Goiaba', 'frutas', 100, 'unidade', 68, 2, 14, 1, 5),
  createItem('frut_kiwi', 'Kiwi', 'frutas', 75, 'unidade', 46, 0.9, 11, 0.4, 2),
  createItem('frut_acai', 'Açaí (sem adição)', 'frutas', 100, 'g', 58, 1, 6, 3, 2),
  createItem('frut_abacate', 'Abacate', 'frutas', 100, 'g', 160, 2, 9, 15, 7),

  // ==========================================
  // LATICÍNIOS (Dairy)
  // ==========================================
  createItem('lact_leite_integral', 'Leite integral', 'laticinios', 200, 'ml', 122, 6, 10, 6),
  createItem('lact_leite_desnatado', 'Leite desnatado', 'laticinios', 200, 'ml', 68, 7, 10, 0),
  createItem('lact_iogurte_natural', 'Iogurte natural', 'laticinios', 170, 'pote', 100, 6, 8, 5),
  createItem('lact_iogurte_grego', 'Iogurte grego', 'laticinios', 100, 'pote', 97, 9, 4, 5),
  createItem('lact_iogurte_desnatado', 'Iogurte desnatado', 'laticinios', 170, 'pote', 72, 6, 12, 0),
  createItem('lact_queijo_branco', 'Queijo branco (minas)', 'laticinios', 30, 'fatia', 79, 6, 1, 6),
  createItem('lact_queijo_mussarela', 'Queijo mussarela', 'laticinios', 30, 'fatia', 90, 6, 1, 7),
  createItem('lact_queijo_prato', 'Queijo prato', 'laticinios', 30, 'fatia', 105, 7, 0, 9),
  createItem('lact_requeijao', 'Requeijão', 'laticinios', 30, 'colher de sopa', 81, 2, 1, 8),
  createItem('lact_cream_cheese', 'Cream cheese', 'laticinios', 30, 'colher de sopa', 99, 2, 1, 10),
  createItem('lact_ricota', 'Ricota', 'laticinios', 30, 'porção', 41, 3, 1, 3),
  createItem('lact_cottage', 'Queijo cottage', 'laticinios', 50, 'porção', 49, 6, 2, 2),

  // ==========================================
  // GORDURAS (Fats/Oils)
  // ==========================================
  createItem('gord_azeite', 'Azeite de oliva', 'gorduras', 13, 'colher de sopa', 117, 0, 0, 13),
  createItem('gord_oleo_coco', 'Óleo de coco', 'gorduras', 13, 'colher de sopa', 117, 0, 0, 13),
  createItem('gord_manteiga', 'Manteiga', 'gorduras', 10, 'colher de chá', 72, 0, 0, 8),
  createItem('gord_margarina', 'Margarina', 'gorduras', 10, 'colher de chá', 54, 0, 0, 6),
  createItem('gord_castanha_para', 'Castanha do Pará', 'gorduras', 10, 'unidade', 66, 1, 1, 7),
  createItem('gord_castanha_caju', 'Castanha de caju', 'gorduras', 15, 'porção', 86, 3, 4, 7),
  createItem('gord_amendoim', 'Amendoim torrado', 'gorduras', 20, 'porção', 115, 5, 4, 10),
  createItem('gord_amendoas', 'Amêndoas', 'gorduras', 15, 'porção', 87, 3, 3, 8),
  createItem('gord_nozes', 'Nozes', 'gorduras', 15, 'porção', 98, 2, 2, 10),
  createItem('gord_pasta_amendoim', 'Pasta de amendoim', 'gorduras', 15, 'colher de sopa', 94, 4, 3, 8),
  createItem('gord_semente_chia', 'Semente de chia', 'gorduras', 15, 'colher de sopa', 73, 2, 6, 5, 5),
  createItem('gord_semente_linhaca', 'Semente de linhaça', 'gorduras', 10, 'colher de sopa', 53, 2, 3, 4, 3),

  // ==========================================
  // BEBIDAS (Beverages)
  // ==========================================
  createItem('beb_cafe_sem_acucar', 'Café sem açúcar', 'bebidas', 50, 'xícara', 2, 0, 0, 0),
  createItem('beb_cafe_com_leite', 'Café com leite', 'bebidas', 150, 'xícara', 47, 3, 4, 2),
  createItem('beb_cha_sem_acucar', 'Chá sem açúcar', 'bebidas', 200, 'xícara', 2, 0, 0, 0),
  createItem('beb_suco_laranja', 'Suco de laranja natural', 'bebidas', 200, 'ml', 88, 1, 21, 0),
  createItem('beb_suco_verde', 'Suco verde', 'bebidas', 200, 'ml', 60, 1, 14, 0, 2),
  createItem('beb_agua_coco', 'Água de coco', 'bebidas', 200, 'ml', 40, 0, 9, 0),
  createItem('beb_vitamina_banana', 'Vitamina de banana', 'bebidas', 250, 'ml', 180, 6, 32, 4),
  createItem('beb_smoothie_frutas', 'Smoothie de frutas', 'bebidas', 250, 'ml', 150, 3, 32, 2),
  createItem('beb_leite_vegetal', 'Leite vegetal (sem açúcar)', 'bebidas', 200, 'ml', 50, 2, 4, 3),

  // ==========================================
  // DOCES (Sweets) - smaller portions for tracking
  // ==========================================
  createItem('doce_mel', 'Mel', 'doces', 21, 'colher de sopa', 64, 0, 17, 0),
  createItem('doce_acucar', 'Açúcar', 'doces', 5, 'colher de chá', 20, 0, 5, 0),
  createItem('doce_chocolate_amargo', 'Chocolate amargo (70%)', 'doces', 25, 'quadrado', 146, 2, 11, 12),
  createItem('doce_chocolate_ao_leite', 'Chocolate ao leite', 'doces', 25, 'quadrado', 134, 2, 15, 8),
  createItem('doce_bolo_simples', 'Bolo simples', 'doces', 60, 'fatia', 188, 3, 30, 7),
  createItem('doce_pudim', 'Pudim', 'doces', 80, 'porção', 193, 4, 29, 7),
  createItem('doce_brigadeiro', 'Brigadeiro', 'doces', 20, 'unidade', 68, 1, 11, 2),
  createItem('doce_sorvete', 'Sorvete', 'doces', 80, 'bola', 137, 2, 18, 7),
  createItem('doce_paçoca', 'Paçoca', 'doces', 20, 'unidade', 94, 3, 10, 5),
  createItem('doce_goiabada', 'Goiabada', 'doces', 40, 'fatia', 116, 0.4, 29, 0),

  // ==========================================
  // REFEIÇÕES COMUNS (Complete meals)
  // ==========================================
  createItem('ref_pf_basico', 'Prato feito básico (arroz, feijão, carne, salada)', 'refeicoes', 400, 'prato', 520, 30, 55, 18),
  createItem('ref_strogonoff', 'Strogonoff de frango', 'refeicoes', 200, 'porção', 280, 25, 8, 17),
  createItem('ref_feijoada', 'Feijoada', 'refeicoes', 300, 'porção', 465, 28, 33, 25),
  createItem('ref_moqueca', 'Moqueca de peixe', 'refeicoes', 250, 'porção', 280, 25, 10, 16),
  createItem('ref_escondidinho', 'Escondidinho de frango', 'refeicoes', 200, 'porção', 290, 18, 28, 12),
  createItem('ref_galinhada', 'Galinhada', 'refeicoes', 300, 'porção', 380, 25, 40, 13),
  createItem('ref_carne_sol', 'Carne de sol com macaxeira', 'refeicoes', 300, 'porção', 420, 28, 40, 16),
  createItem('ref_baiao_dois', 'Baião de dois', 'refeicoes', 250, 'porção', 350, 18, 42, 12),
  createItem('ref_lasanha', 'Lasanha', 'refeicoes', 200, 'porção', 320, 18, 28, 15),
  createItem('ref_empadao', 'Empadão de frango', 'refeicoes', 150, 'fatia', 340, 15, 30, 18),
  createItem('ref_sanduiche_natural', 'Sanduíche natural', 'refeicoes', 150, 'unidade', 250, 15, 25, 10),
  createItem('ref_omelete', 'Omelete (2 ovos)', 'refeicoes', 120, 'porção', 185, 13, 2, 14),
  createItem('ref_crepioca', 'Crepioca', 'refeicoes', 100, 'unidade', 180, 12, 17, 7),
  createItem('ref_acai_tigela', 'Açaí na tigela (com granola e banana)', 'refeicoes', 250, 'tigela', 380, 5, 60, 14),

  // ==========================================
  // OUTROS (Others)
  // ==========================================
  createItem('outro_molho_tomate', 'Molho de tomate', 'outros', 50, 'colher de sopa', 19, 1, 4, 0, 1),
  createItem('outro_ketchup', 'Ketchup', 'outros', 15, 'colher de sopa', 17, 0, 4, 0),
  createItem('outro_mostarda', 'Mostarda', 'outros', 10, 'colher de chá', 6, 0.5, 0.5, 0.3),
  createItem('outro_maionese', 'Maionese', 'outros', 15, 'colher de sopa', 100, 0, 0, 11),
  createItem('outro_maionese_light', 'Maionese light', 'outros', 15, 'colher de sopa', 35, 0, 2, 3),
  createItem('outro_vinagrete', 'Vinagrete', 'outros', 50, 'porção', 35, 0.5, 4, 2),
  createItem('outro_caldo_feijao', 'Caldo de feijão', 'outros', 100, 'concha', 50, 3, 9, 0.5),
  createItem('outro_farinha_mandioca', 'Farinha de mandioca', 'outros', 20, 'colher de sopa', 72, 0.3, 18, 0, 1),
  createItem('outro_pimenta', 'Pimenta', 'outros', 5, 'porção', 2, 0, 0.5, 0),
  createItem('outro_limao', 'Limão (suco)', 'outros', 15, 'colher de sopa', 3, 0, 1, 0),
];

// Get meal type display names in Portuguese
export const MEAL_TYPE_NAMES: Record<MealType, string> = {
  'cafe_manha': 'Café da Manhã',
  'lanche_manha': 'Lanche da Manhã',
  'almoco': 'Almoço',
  'lanche_tarde': 'Lanche da Tarde',
  'jantar': 'Jantar',
  'ceia': 'Ceia'
};

// Get meal type icons (emoji)
export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  'cafe_manha': '☀️',
  'lanche_manha': '🍎',
  'almoco': '🍽️',
  'lanche_tarde': '🥤',
  'jantar': '🌙',
  'ceia': '🌃'
};

// Default order for meal types throughout the day
export const MEAL_TYPE_ORDER: MealType[] = [
  'cafe_manha',
  'lanche_manha',
  'almoco',
  'lanche_tarde',
  'jantar',
  'ceia'
];

// Category display names
export const CATEGORY_NAMES: Record<MealItemCategory, string> = {
  'proteinas': 'Proteínas',
  'carboidratos': 'Carboidratos',
  'vegetais': 'Vegetais',
  'frutas': 'Frutas',
  'laticinios': 'Laticínios',
  'gorduras': 'Gorduras',
  'bebidas': 'Bebidas',
  'doces': 'Doces',
  'refeicoes': 'Refeições',
  'outros': 'Outros'
};

// Helper to search items by name
export function searchMealItems(items: MealItem[], query: string): MealItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return items;

  return items.filter(item =>
    item.name.toLowerCase().includes(normalizedQuery) ||
    item.category.toLowerCase().includes(normalizedQuery)
  );
}

// Helper to get items by category
export function getItemsByCategory(items: MealItem[], category: MealItemCategory): MealItem[] {
  return items.filter(item => item.category === category);
}

// Helper to calculate macros for a given quantity
export function calculateMacrosForQuantity(item: MealItem, quantity: number): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
} {
  const { macrosPerServing } = item;
  return {
    calories: Math.round(macrosPerServing.calories * quantity),
    protein: Math.round(macrosPerServing.protein * quantity * 10) / 10,
    carbs: Math.round(macrosPerServing.carbs * quantity * 10) / 10,
    fat: Math.round(macrosPerServing.fat * quantity * 10) / 10,
    fiber: macrosPerServing.fiber ? Math.round(macrosPerServing.fiber * quantity * 10) / 10 : undefined
  };
}

// Helper to sum multiple macro entries
export function sumMacros(macrosList: Array<{ calories: number; protein: number; carbs: number; fat: number; fiber?: number }>): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
} {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;

  for (const item of macrosList) {
    calories += item.calories;
    protein += item.protein;
    carbs += item.carbs;
    fat += item.fat;
    fiber += item.fiber || 0;
  }

  return { calories, protein, carbs, fat, fiber };
}

// Default nutritional goals for Dani (50 year old Brazilian woman)
// Based on research: 1550-1650 kcal/day, 1.0-1.2g protein per kg body weight
export const DEFAULT_NUTRITION_GOALS = {
  dailyCalories: 1600,  // Conservative estimate for maintenance
  dailyProtein: 70,     // Assuming ~60-65kg body weight × 1.1g/kg
  dailyCarbs: 180,      // ~45% of calories from carbs
  dailyFat: 55          // ~30% of calories from fat
};
