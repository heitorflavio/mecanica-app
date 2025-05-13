import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Material } from '../models/materials';

interface MaterialCardProps {
  material: Material;
  onSelect: (material: Material) => void;
  isSelected: boolean;
}

export default function MaterialCard({ material, onSelect, isSelected }: MaterialCardProps) {
  const accessibilityProps = Platform.select({
    ios: {
      accessibilityHint: `Selecionar ${material.nome} como material para o ensaio`,
      accessibilityLabel: `${material.nome}. ${material.descricao}`,
    },
    android: {
      accessibilityHint: `Selecionar ${material.nome} como material para o ensaio`,
      accessibilityLabel: `${material.nome}. ${material.descricao}`,
    },
    default: {},
  });

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]}
      onPress={() => onSelect(material)}
      activeOpacity={0.7}
      role="button"
      {...accessibilityProps}
    >
      <View style={[styles.colorIndicator, { backgroundColor: material.cor }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{material.nome}</Text>
        <Text style={styles.description}>{material.descricao}</Text>
        
        <View style={styles.propertiesContainer}>
          <View style={styles.propertyRow}>
            <View style={styles.property}>
              <Text style={styles.propertyLabel}>Módulo E:</Text>
              <Text style={styles.propertyValue}>{material.moduloElasticidade} GPa</Text>
            </View>
            <View style={styles.property}>
              <Text style={styles.propertyLabel}>Limite Esc.:</Text>
              <Text style={styles.propertyValue}>{material.limiteEscoamento} MPa</Text>
            </View>
          </View>
          
          <View style={styles.propertyRow}>
            <View style={styles.property}>
              <Text style={styles.propertyLabel}>Resist. Máx.:</Text>
              <Text style={styles.propertyValue}>{material.resistenciaMaxima} MPa</Text>
            </View>
            <View style={styles.property}>
              <Text style={styles.propertyLabel}>Along. Rupt.:</Text>
              <Text style={styles.propertyValue}>{(material.alongamentoRuptura * 100).toFixed(0)}%</Text>
            </View>
          </View>
        </View>
      </View>
      
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>Selecionado</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCard: {
    borderColor: '#0066CC',
    borderWidth: 2,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  colorIndicator: {
    width: 12,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  propertiesContainer: {
    marginTop: 8,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#0066CC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});