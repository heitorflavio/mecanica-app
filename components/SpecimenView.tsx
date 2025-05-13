import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SimulationState, getPhaseColor } from '../models/simulation';
import { Material } from '../models/materials';

interface SpecimenViewProps {
  material: Material;
  simulationState: SimulationState;
}

export default function SpecimenView({ material, simulationState }: SpecimenViewProps) {
  // Criar valores animados para largura e cor
  const width = useSharedValue(100);
  const colorValue = useSharedValue(0);
  
  // Reagir a mudanças no estado da simulação
  useEffect(() => {
    // Calcular nova largura com base na deformação atual
    // Limitar a um valor razoável para visualização
    const maxVisualization = Math.min(simulationState.currentStrain, material.alongamentoRuptura * 1.1);
    const strainPercentage = maxVisualization / material.alongamentoRuptura;
    const newWidth = 100 + (strainPercentage * 100);
    
    // Animar a largura
    width.value = withTiming(
      simulationState.ruptured ? 10 : newWidth, 
      { 
        duration: 300, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      }
    );
    
    // Animar a cor (0 = inicial, 1 = elástica, 2 = plástica, 3 = ruptura)
    const phaseValue = 
      simulationState.currentPhase === 'inicial' ? 0 :
      simulationState.currentPhase === 'elastica' ? 1 :
      simulationState.currentPhase === 'plastica' ? 2 : 3;
    
    colorValue.value = withTiming(phaseValue, { duration: 300 });
  }, [simulationState, material]);
  
  // Estilo animado para o corpo de prova
  const specimenStyle = useAnimatedStyle(() => {
    // Mapear valor da fase para cor
    const backgroundColor = 
      colorValue.value === 0 ? material.cor :
      colorValue.value < 1 ? material.cor :
      colorValue.value < 2 ? material.cor : 
      colorValue.value < 3 ? material.cor : '#E63946';
    
    // Adicionar efeito de opacidade
    const opacity = simulationState.ruptured ? 0.3 : 1;
    
    return {
      width: `${width.value}%`,
      backgroundColor,
      opacity,
    };
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Corpo de Prova</Text>
      
      <View style={styles.specimenContainer}>
        <View style={styles.fixture} />
        <Animated.View style={[styles.specimen, specimenStyle]} />
        <View style={styles.fixture} />
      </View>
      
      <View style={styles.indicatorContainer}>
        <View style={styles.indicator}>
          <Text style={styles.indicatorLabel}>Fase:</Text>
          <View style={[
            styles.phaseIndicator, 
            { backgroundColor: getPhaseColor(simulationState.currentPhase) }
          ]}>
            <Text style={styles.phaseText}>
              {
                simulationState.currentPhase === 'inicial' ? 'Inicial' :
                simulationState.currentPhase === 'elastica' ? 'Elástica' :
                simulationState.currentPhase === 'plastica' ? 'Plástica' : 'Ruptura'
              }
            </Text>
          </View>
        </View>
        
        <View style={styles.indicator}>
          <Text style={styles.indicatorLabel}>Deformação:</Text>
          <Text style={styles.indicatorValue}>
            {Math.round(simulationState.currentStrain * 10000) / 100}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  specimenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginBottom: 20,
  },
  fixture: {
    width: 20,
    height: 60,
    backgroundColor: '#666',
    borderRadius: 4,
  },
  specimen: {
    height: 30,
    backgroundColor: '#888',
    marginHorizontal: 0,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  indicator: {
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  phaseIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  phaseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});