import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import MaterialCard from '../components/MaterialCard';
import { materiais, Material } from '../models/materials';

export default function MaterialSelectionScreen() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const handleSelectMaterial = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleContinue = () => {
    if (selectedMaterial) {
      router.push({
        pathname: '/simulacao',
        params: { materialId: selectedMaterial.id }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Selecione um Material</Text>
        <Text style={styles.subtitle}>
          Escolha um material para realizar o ensaio de tração virtual
        </Text>

        <FlatList
          data={materiais}
          renderItem={({ item }) => (
            <MaterialCard
              material={item}
              onSelect={handleSelectMaterial}
              isSelected={selectedMaterial?.id === item.id}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              !selectedMaterial && styles.buttonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedMaterial}
          >
            <Text style={styles.buttonText}>Continuar</Text>
            <ChevronRight color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  list: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 16,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#0066CC',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});