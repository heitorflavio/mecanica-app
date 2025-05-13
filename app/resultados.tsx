import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Chrome as Home, RotateCcw } from 'lucide-react-native';
import { materiais } from '../models/materials';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const materialId = params.materialId as string;
  const maxStress = parseFloat(params.maxStress as string || '0');
  const maxStrain = parseFloat(params.maxStrain as string || '0');
  const ruptured = params.ruptured === '1';
  
  const [material, setMaterial] = useState(materiais.find(m => m.id === materialId));

  useEffect(() => {
    if (!material) {
      Alert.alert(
        "Material não encontrado",
        "Não foi possível encontrar os dados do material.",
        [{ text: "OK", onPress: () => router.replace('/') }]
      );
    }
  }, [material]);

  if (!material) {
    return null;
  }

  const calculateElongation = () => {
    return (maxStrain * 100).toFixed(2);
  };

  const getPerformanceEvaluation = () => {
    const stressPercentage = maxStress / material.resistenciaMaxima;
    const strainPercentage = maxStrain / material.alongamentoRuptura;
    
    if (stressPercentage >= 0.95) {
      return "Excelente";
    } else if (stressPercentage >= 0.8) {
      return "Muito Bom";
    } else if (stressPercentage >= 0.6) {
      return "Bom";
    } else if (stressPercentage >= 0.4) {
      return "Regular";
    } else {
      return "Baixo";
    }
  };

  const getResultMessage = () => {
    if (ruptured) {
      return "O material suportou a carga até o limite de ruptura.";
    } else {
      return "O ensaio foi encerrado antes da ruptura do material.";
    }
  };

  const handlePlayAgain = () => {
    router.replace('/selecao-material');
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Resultados do Ensaio</Text>
            <Text style={styles.subtitle}>{material.nome}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Desempenho: {getPerformanceEvaluation()}</Text>
            <Text style={styles.resultDescription}>{getResultMessage()}</Text>

            <View style={styles.divider} />

            <View style={styles.metricsContainer}>
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Tensão Máxima</Text>
                  <Text style={styles.metricValue}>{maxStress.toFixed(2)} MPa</Text>
                  <Text style={styles.metricCompare}>
                    ({((maxStress / material.resistenciaMaxima) * 100).toFixed(1)}% do limite)
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Deformação Máxima</Text>
                  <Text style={styles.metricValue}>{calculateElongation()}%</Text>
                  <Text style={styles.metricCompare}>
                    ({((maxStrain / material.alongamentoRuptura) * 100).toFixed(1)}% do limite)
                  </Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Estado Final</Text>
                  <Text style={[
                    styles.metricValue, 
                    { color: ruptured ? '#E63946' : '#4CAF50' }
                  ]}>
                    {ruptured ? 'Rompido' : 'Intacto'}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Material</Text>
                  <Text style={styles.metricValue}>{material.nome}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.materialPropertiesCard}>
            <Text style={styles.cardTitle}>Propriedades do Material</Text>
            
            <View style={styles.propertyRow}>
              <View style={styles.property}>
                <Text style={styles.propertyLabel}>Módulo de Elasticidade:</Text>
                <Text style={styles.propertyValue}>{material.moduloElasticidade} GPa</Text>
              </View>
              <View style={styles.property}>
                <Text style={styles.propertyLabel}>Limite de Escoamento:</Text>
                <Text style={styles.propertyValue}>{material.limiteEscoamento} MPa</Text>
              </View>
            </View>
            
            <View style={styles.propertyRow}>
              <View style={styles.property}>
                <Text style={styles.propertyLabel}>Resistência Máxima:</Text>
                <Text style={styles.propertyValue}>{material.resistenciaMaxima} MPa</Text>
              </View>
              <View style={styles.property}>
                <Text style={styles.propertyLabel}>Alongamento na Ruptura:</Text>
                <Text style={styles.propertyValue}>{(material.alongamentoRuptura * 100).toFixed(0)}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.conclusionCard}>
            <Text style={styles.cardTitle}>Conclusão do Ensaio</Text>
            <Text style={styles.conclusionText}>
              {ruptured 
                ? `O ensaio demonstrou que o ${material.nome} suportou tensão até aproximadamente ${maxStress.toFixed(0)} MPa, deformando ${calculateElongation()}% antes de romper.`
                : `No ensaio, o ${material.nome} foi submetido a uma tensão máxima de ${maxStress.toFixed(0)} MPa, resultando em ${calculateElongation()}% de deformação sem romper.`
              }
            </Text>
            <Text style={styles.conclusionText}>
              Este comportamento é típico de materiais {
                material.alongamentoRuptura > 0.2 ? 'dúcteis' : 'frágeis'
              }, onde a {
                material.alongamentoRuptura > 0.2 
                  ? 'fase plástica permite grande deformação antes da ruptura'
                  : 'ruptura ocorre com pouca deformação plástica'
              }.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.homeButton]}
          onPress={handleGoHome}
        >
          <Home color="#333" size={20} />
          <Text style={styles.homeButtonText}>Início</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.playAgainButton]}
          onPress={handlePlayAgain}
        >
          <RotateCcw color="white" size={20} />
          <Text style={styles.playAgainButtonText}>Novo Ensaio</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 16,
  },
  metricsContainer: {
    marginTop: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    marginHorizontal: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  metricCompare: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  materialPropertiesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  property: {
    flex: 1,
    marginRight: 8,
  },
  propertyLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  propertyValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  conclusionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conclusionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
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
  homeButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  playAgainButton: {
    backgroundColor: '#0066CC',
  },
  homeButtonText: {
    color: '#333',
    fontWeight: '600',
    marginLeft: 8,
  },
  playAgainButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});