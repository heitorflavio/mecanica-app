import { Material } from './materials';

export type SimulationPhase = 'inicial' | 'elastica' | 'plastica' | 'ruptura';

export interface SimulationPoint {
  strain: number;
  stress: number;
  phase: SimulationPhase;
}

export interface SimulationState {
  currentStrain: number;
  currentStress: number;
  currentPhase: SimulationPhase;
  dataPoints: SimulationPoint[];
  maxStrain: number;
  maxStress: number;
  ruptured: boolean;
}

export const initialSimulationState: SimulationState = {
  currentStrain: 0,
  currentStress: 0,
  currentPhase: 'inicial',
  dataPoints: [],
  maxStrain: 0,
  maxStress: 0,
  ruptured: false,
};

/**
 * Calcula a tensão baseada na deformação atual e na fase do material
 * @param material Material selecionado
 * @param strain Deformação atual
 * @returns Objeto contendo a tensão calculada e a fase atual
 */
export function calculateStressAndPhase(
  material: Material,
  strain: number
): { stress: number; phase: SimulationPhase } {
  // Deformação zero
  if (strain === 0) {
    return { stress: 0, phase: 'inicial' };
  }

  // Converter módulo de elasticidade de GPa para MPa
  const E = material.moduloElasticidade * 1000;
  
  // Deformação na fase elástica (Lei de Hooke: σ = E * ε)
  const deformacaoEscoamento = material.limiteEscoamento / E;
  
  if (strain <= deformacaoEscoamento) {
    // Região elástica
    return { 
      stress: E * strain,
      phase: 'elastica'
    };
  } else if (strain <= material.alongamentoRuptura) {
    // Região plástica - usando o modelo de Hollomon: σ = K * ε^n
    // Se os coeficientes plásticos não estiverem disponíveis, usar aproximação simples
    const k = material.coeficienteK || material.resistenciaMaxima * 1.2;
    const n = material.exponenteN || 0.2;
    
    return {
      stress: k * Math.pow(strain, n),
      phase: 'plastica'
    };
  } else {
    // Ruptura
    return {
      stress: 0,
      phase: 'ruptura'
    };
  }
}

/**
 * Incrementa a deformação e calcula o novo estado da simulação
 * @param material Material selecionado
 * @param currentState Estado atual da simulação
 * @param increment Incremento de deformação
 * @returns Novo estado da simulação
 */
export function incrementStrain(
  material: Material,
  currentState: SimulationState,
  increment: number
): SimulationState {
  // Se já rompeu, não fazer nada
  if (currentState.ruptured) {
    return currentState;
  }

  // Calcular nova deformação
  const newStrain = currentState.currentStrain + increment;
  
  // Calcular tensão e fase para a nova deformação
  const { stress, phase } = calculateStressAndPhase(material, newStrain);
  
  // Verificar se rompeu
  const ruptured = phase === 'ruptura';
  
  // Criar novo ponto de dados
  const newDataPoint: SimulationPoint = {
    strain: newStrain,
    stress: stress,
    phase: phase
  };
  
  // Atualizar pontos de dados
  const dataPoints = [...currentState.dataPoints, newDataPoint];
  
  // Atualizar valores máximos
  const maxStrain = Math.max(currentState.maxStrain, newStrain);
  const maxStress = Math.max(currentState.maxStress, stress);
  
  return {
    currentStrain: newStrain,
    currentStress: stress,
    currentPhase: phase,
    dataPoints,
    maxStrain,
    maxStress,
    ruptured
  };
}

/**
 * Formata um valor numérico para exibição
 * @param value Valor a ser formatado
 * @param decimals Número de casas decimais
 * @returns String formatada
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Retorna a cor da fase atual
 * @param phase Fase atual da simulação
 * @returns Código de cor
 */
export function getPhaseColor(phase: SimulationPhase): string {
  switch (phase) {
    case 'inicial':
      return '#888888';
    case 'elastica':
      return '#0066CC';
    case 'plastica':
      return '#FF9500';
    case 'ruptura':
      return '#E63946';
    default:
      return '#888888';
  }
}

/**
 * Retorna o texto descritivo da fase atual
 * @param phase Fase atual da simulação
 * @returns Texto descritivo
 */
export function getPhaseText(phase: SimulationPhase): string {
  switch (phase) {
    case 'inicial':
      return 'Fase Inicial';
    case 'elastica':
      return 'Fase Elástica';
    case 'plastica':
      return 'Fase Plástica';
    case 'ruptura':
      return 'Ruptura';
    default:
      return 'Desconhecido';
  }
}