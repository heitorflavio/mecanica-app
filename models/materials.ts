export interface Material {
  id: string;
  nome: string;
  moduloElasticidade: number; // GPa
  limiteEscoamento: number; // MPa
  resistenciaMaxima: number; // MPa
  alongamentoRuptura: number; // % (decimal)
  coeficienteK?: number; // MPa
  exponenteN?: number; // adimensional
  cor: string;
  descricao: string;
}

// Valores baseados em propriedades típicas dos materiais
export const materiais: Material[] = [
  {
    id: 'aco1020',
    nome: 'Aço 1020',
    moduloElasticidade: 210, // GPa
    limiteEscoamento: 350, // MPa
    resistenciaMaxima: 420, // MPa
    alongamentoRuptura: 0.15, // 15%
    coeficienteK: 600, // MPa
    exponenteN: 0.18,
    cor: '#505050',
    descricao: 'Aço de baixo carbono, com boa formabilidade e soldabilidade.'
  },
  {
    id: 'alu6061',
    nome: 'Alumínio 6061',
    moduloElasticidade: 70, // GPa
    limiteEscoamento: 240, // MPa
    resistenciaMaxima: 290, // MPa
    alongamentoRuptura: 0.12, // 12%
    coeficienteK: 350, // MPa
    exponenteN: 0.15,
    cor: '#C0C0C0',
    descricao: 'Liga de alumínio tratável termicamente, boa resistência à corrosão.'
  },
  {
    id: 'cobre',
    nome: 'Cobre',
    moduloElasticidade: 120, // GPa
    limiteEscoamento: 70, // MPa
    resistenciaMaxima: 220, // MPa
    alongamentoRuptura: 0.45, // 45%
    coeficienteK: 320, // MPa
    exponenteN: 0.35,
    cor: '#B87333',
    descricao: 'Metal com excelente condutividade térmica e elétrica.'
  },
  {
    id: 'titanio',
    nome: 'Titânio Ti-6Al-4V',
    moduloElasticidade: 110, // GPa
    limiteEscoamento: 830, // MPa
    resistenciaMaxima: 900, // MPa
    alongamentoRuptura: 0.10, // 10%
    coeficienteK: 1200, // MPa
    exponenteN: 0.07,
    cor: '#8A9A9A',
    descricao: 'Liga de titânio com alta resistência específica, usada em aeronaves.'
  },
  {
    id: 'abs',
    nome: 'Plástico ABS',
    moduloElasticidade: 2.3, // GPa
    limiteEscoamento: 45, // MPa
    resistenciaMaxima: 65, // MPa
    alongamentoRuptura: 0.05, // 5%
    coeficienteK: 80, // MPa
    exponenteN: 0.06,
    cor: '#F7E67A',
    descricao: 'Termoplástico rígido e leve usado em peças automotivas e eletrônicos.'
  }
];