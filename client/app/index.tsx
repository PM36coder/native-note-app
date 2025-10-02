import { View, Text, TouchableOpacity, StyleSheet,  StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header Section */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.title}>Note App</Text>
          <Text style={styles.subtitle}>
            Your thoughts, organized and secure
          </Text>
        </View>

        {/* Illustration/Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>✍️</Text>
            <Text style={styles.featureText}>Write & Organize</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔒</Text>
            <Text style={styles.featureText}>Secure & Private</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>☁️</Text>
            <Text style={styles.featureText}>Cloud Sync</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton}
            // onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            // onPress={() => router.push('/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for better note-taking
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});