import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter } from 'victory-native';
import { SimulationPoint } from '../models/simulation';

interface StressStrainChartProps {
  dataPoints: SimulationPoint[];
  maxStress?: number;
  maxStrain?: number;
  width?: number;
  height?: number;
}

export default function StressStrainChart({
  dataPoints,
  maxStress = 500,
  maxStrain = 0.2,
  width = Dimensions.get('window').width * 0.95,
  height = 220
}: StressStrainChartProps) {
  // Se não houver pontos, adicionar um ponto na origem
  const chartData = dataPoints.length > 0 
    ? dataPoints 
    : [{ strain: 0, stress: 0, phase: 'inicial' }];

  // Agrupar pontos por fase
  const elasticPoints = chartData.filter(point => point.phase === 'elastica');
  const plasticPoints = chartData.filter(point => point.phase === 'plastica');
  const rupturePoints = chartData.filter(point => point.phase === 'ruptura');
  
  // Calcular o domínio do gráfico
  const domainY = [0, Math.max(maxStress * 1.1, 10)];
  const domainX = [0, Math.max(maxStrain * 1.1, 0.01)];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Curva Tensão-Deformação</Text>
      <VictoryChart
        width={width}
        height={height}
        padding={{ top: 10, bottom: 40, left: 60, right: 20 }}
        domain={{ x: domainX, y: domainY }}
      >
        <VictoryAxis
          label="Deformação (ε)"
          style={{
            axisLabel: { fontSize: 12, padding: 30 },
            tickLabels: { fontSize: 10, padding: 5 },
            grid: { stroke: ({ tick }) => tick % 0.05 === 0 ? '#ddd' : 'transparent', strokeDasharray: '2,2' },
          }}
          tickFormat={(t) => `${(t * 100).toFixed(0)}%`}
        />
        <VictoryAxis
          dependentAxis
          label="Tensão (σ) - MPa"
          style={{
            axisLabel: { fontSize: 12, padding: 40 },
            tickLabels: { fontSize: 10, padding: 5 },
            grid: { stroke: ({ tick }) => tick % 50 === 0 ? '#ddd' : 'transparent', strokeDasharray: '2,2' },
          }}
        />
        
        {/* Fase elástica */}
        {elasticPoints.length > 0 && (
          <VictoryLine
            data={elasticPoints}
            x="strain"
            y="stress"
            style={{ data: { stroke: '#0066CC', strokeWidth: 2 } }}
          />
        )}
        
        {/* Fase plástica */}
        {plasticPoints.length > 0 && (
          <VictoryLine
            data={plasticPoints}
            x="strain"
            y="stress"
            style={{ data: { stroke: '#FF9500', strokeWidth: 2 } }}
          />
        )}
        
        {/* Ponto atual */}
        {chartData.length > 0 && (
          <VictoryScatter
            data={[chartData[chartData.length - 1]]}
            x="strain"
            y="stress"
            size={6}
            style={{ data: { fill: '#E63946' } }}
          />
        )}
        
        {/* Ponto de ruptura */}
        {rupturePoints.length > 0 && (
          <VictoryScatter
            data={[rupturePoints[0]]}
            x="strain"
            y="stress"
            size={8}
            style={{ data: { fill: '#E63946' } }}
          />
        )}
      </VictoryChart>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#0066CC' }]} />
          <Text style={styles.legendText}>Elástica</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF9500' }]} />
          <Text style={styles.legendText}>Plástica</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E63946' }]} />
          <Text style={styles.legendText}>Ruptura</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
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
    textAlign: 'center',
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});