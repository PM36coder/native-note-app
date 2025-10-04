import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView // ScrollView use karenge taaki content chhupe nahi
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import API from '@/assets/components/axios/axios';
import { useAuth } from '@/assets/components/context/context'; // Aapka Auth Context

// --- 1. Interface Definition (Interface is better for object shapes) ---
interface INoteData {
  title: string;
  content: string;
}

const CreateNoteScreen = () => {
  const router = useRouter();
  const { token } = useAuth(); // Token ki zaroorat nahi hai, kyunki Axios Interceptor mein hai
  
  const [formData, setFormData] = useState<INoteData>({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);

  // --- 2. Form Input Change Handler ---
  const handleInputChange = (field: keyof INoteData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- 3. API Call Handler ---
  const handleCreateNote = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert('Error', 'Title and content cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      // API Call: Axios Interceptor automatically token add kar dega
      const response = await API.post('/create', formData,{
       
        
          headers:{
            'Authorization' : `Bearer ${token}`
          }
        ,
      
      });

      const data = response.data;
      
      Alert.alert('Success', data.message || 'Note created successfully!');
      
      // Successfully create hone ke baad:
      setFormData({ title: '', content: '' }); // Form reset karna
      router.push('/(tabs)/notes'); // Notes List (index tab) par  jana
      
    } catch (error:any) {
      let errorMessage = 'Failed to create note. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
      console.error('Note Creation Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        // iOS ke  'padding' ya 'height' aur ScrollView, Android ke liye 'padding' is best
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
            <Text style={styles.title}>Create a New Note</Text>
            <Text style={styles.subtitle}>What&apos;s on your mind?</Text>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Give your note a title..."
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholderTextColor="#999"
            />
          </View>

          {/* Content Input (Multiline) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Start writing your thoughts here..."
              value={formData.content}
              onChangeText={(text) => handleInputChange('content', text)}
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={10}
            />
          </View>
        </ScrollView>
        
        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleCreateNote}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Note</Text>
          )}
        </TouchableOpacity>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default CreateNoteScreen;

// --- 4. Styling ---
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#f8f8f8',
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    header: {
        paddingVertical: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      color: '#333',
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    contentInput: {
      minHeight: 200, // Multiline content ke liye zyada height
      textAlignVertical: 'top', // Text ko top se shuru karna
      paddingTop: 15,
    },
    saveButton: {
      backgroundColor: '#007AFF',
      borderRadius: 12,
      padding: 18,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: Platform.OS === 'ios' ? 10 : 20, // Bottom margin
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#a0c4ff',
    }
});