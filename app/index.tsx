import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { GraduationCap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <GraduationCap size={80} color="#0066CC" />
        <Text style={styles.title}>Simulador de Ensaio de Tração</Text>
        <Text style={styles.subtitle}>
          Aprenda sobre o comportamento dos materiais sob tração
        </Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/selecao-material')}
        >
          <Text style={styles.buttonText}>Iniciar Simulação</Text>
        </TouchableOpacity>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Este aplicativo simula o comportamento de diferentes materiais durante um ensaio de tração,
            mostrando as fases elástica e plástica até a ruptura.
          </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066CC',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
    maxWidth: 500,
    alignSelf: 'stretch',
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});