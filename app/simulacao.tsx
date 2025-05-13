import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { CircleArrowRight as ArrowRightCircle, ChartLine as LineChart, RefreshCcw } from 'lucide-react-native';
import { materiais } from '../models/materials';
import {
  initialSimulationState,
  SimulationState,
  incrementStrain,
  formatNumber,
  getPhaseText,
  getPhaseColor
} from '../models/simulation';
import StressStrainChart from '../components/StressStrainChart';
import SpecimenView from '../components/SpecimenView';

export default function SimulationScreen() {
  const { materialId } = useLocalSearchParams();
  
  // Buscar o material pelo ID
  const material = materiais.find(m => m.id === materialId);
  
  // Estado da simulação
  const [simulationState, setSimulationState] = useState<SimulationState>(initialSimulationState);
  
  // Se não encontrar o material, redirecionar para a seleção
  useEffect(() => {
    if (!material) {
      Alert.alert(
        "Material não encontrado",
        "Por favor, selecione um material.",
        [{ text: "OK", onPress: () => router.replace('/selecao-material') }]
      );
    }
  }, [material]);
  
  // Se não tiver material, não renderizar nada
  if (!material) {
    return null;
  }
  
  // Incrementar a carga (deformação)
  const handleIncrementLoad = () => {
    if (!simulationState.ruptured) {
      // Incremento baseado no alongamento na ruptura do material
      const increment = material.alongamentoRuptura / 15;
      const newState = incrementStrain(material, simulationState, increment);
      setSimulationState(newState);
    }
  };
  
  // Resetar a simulação
  const handleReset = () => {
    setSimulationState(initialSimulationState);
  };
  
  // Ver resultados
  const handleViewResults = () => {
    router.push({
      pathname: '/resultados',
      params: { 
        materialId: material.id,
        maxStress: simulationState.maxStress.toString(),
        maxStrain: simulationState.maxStrain.toString(),
        ruptured: simulationState.ruptured ? '1' : '0'
      }
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Ensaio de Tração: {material.nome}</Text>
            <Text style={styles.subtitle}>
              Observe como o material se comporta ao aplicar carga
            </Text>
          </View>
          
          {/* Gráfico Tensão x Deformação */}
          <StressStrainChart 
            dataPoints={simulationState.dataPoints} 
            maxStress={Math.max(simulationState.maxStress * 1.2, material.resistenciaMaxima * 1.2)}
            maxStrain={Math.max(simulationState.maxStrain * 1.2, material.alongamentoRuptura * 1.2)}
          />
          
          {/* Visualização do corpo de prova */}
          <SpecimenView 
            material={material} 
            simulationState={simulationState} 
          />
          
          {/* Informações atuais */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tensão Atual:</Text>
                <Text style={styles.infoValue}>{formatNumber(simulationState.currentStress)} MPa</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Deformação Atual:</Text>
                <Text style={styles.infoValue}>{formatNumber(simulationState.currentStrain * 100)}%</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Fase Atual:</Text>
                <View style={[
                  styles.phaseIndicator,
                  { backgroundColor: getPhaseColor(simulationState.currentPhase) }
                ]}>
                  <Text style={styles.phaseText}>
                    {getPhaseText(simulationState.currentPhase)}
                  </Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Material:</Text>
                <Text style={styles.infoValue}>{material.nome}</Text>
              </View>
            </View>
          </View>
          
          {/* Mensagem de ruptura */}
          {simulationState.ruptured && (
            <View style={styles.ruptureMessage}>
              <Text style={styles.ruptureText}>Material Rompido!</Text>
              <Text style={styles.ruptureDescription}>
                O corpo de prova rompeu após atingir seu limite de deformação.
                Você pode reiniciar o ensaio ou ver os resultados.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Controles da simulação */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.resetButton
          ]}
          onPress={handleReset}
        >
          <RefreshCcw color="#333" size={20} />
          <Text style={styles.resetButtonText}>Reiniciar</Text>
        </TouchableOpacity>
        
        {simulationState.ruptured ? (
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.resultsButton
            ]}
            onPress={handleViewResults}
          >
            <LineChart color="white" size={20} />
            <Text style={styles.incrementButtonText}>Ver Resultados</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.incrementButton
            ]}
            onPress={handleIncrementLoad}
          >
            <ArrowRightCircle color="white" size={20} />
            <Text style={styles.incrementButtonText}>Aumentar Carga</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  infoContainer: {
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  phaseIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  phaseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ruptureMessage: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#E63946',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  ruptureText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 8,
  },
  ruptureDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    margin: 4,
  },
  incrementButton: {
    backgroundColor: '#0066CC',
  },
  resetButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  resultsButton: {
    backgroundColor: '#4CAF50',
  },
  incrementButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  resetButtonText: {
    color: '#333',
    fontWeight: '600',
    marginLeft: 8,
  },
});