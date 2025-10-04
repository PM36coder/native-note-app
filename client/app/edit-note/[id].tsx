import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API from '@/assets/components/axios/axios';
import { useAuth } from '@/assets/components/context/context';

// --- 1. Interface Definition ---
interface INote {
    _id: string; // MongoDB se aayegi
    title: string;
    content: string;
    // user aur createdAt fields bhi ho sakti hain
}

export default function EditNote() {
  const router = useRouter();
  const {token} = useAuth()
  // id ko string ki tarah nikalna zaroori hai
  const { id } = useLocalSearchParams<{ id: string }>(); 

  // State mein Note data aur Loading status
  const [formData, setFormData] = useState<INote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- 2. Data Fetching Function ---
  const fetchNoteById = async () => {
    if (!id) return;
    setLoading(true);
    try {
       
        const response = await API.get(`/get-note/${id}`,{
            headers:{
                'Authorization' : `Bearer ${token}`
            }
        });
        
        
        setFormData(response.data.note); 
    } catch (error: any) {
        console.error("Error fetching note:", error.response?.data || error.message);
        Alert.alert("Error", "Could not load note data or you don't own this note.");
        router.back(); 
    } finally {
        setLoading(false);
    }
  };

  // --- 3. Initial Load ---
  useEffect(() => {
    fetchNoteById();
  }, [id]);
  
  // --- 4. Input Change Handler ---
  const handleInputChange = (field: keyof INote, value: string) => {
    setFormData(prev => (prev ? { ...prev, [field]: value } : null));
  };
  
  // --- 5. Update Handler (PUT/PATCH API Call) ---
  const handleUpdateNote = async () => {
    if (!formData || !formData.title.trim() || !formData.content.trim()) {
      Alert.alert('Error', 'Title and content cannot be empty.');
      return;
    }

    setIsUpdating(true);
    try {
      // FIX 1: Data (payload) ko alag karo
      const updateData = {
          title: formData.title,
          content: formData.content,
      };

      // FIX 2: Headers ko alag (third argument, config object) mein bhejo
      await API.put(
          `/update/${id}`, 
          updateData, // <--- Data Payload
          { // <--- Third Argument: Config Object
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          }
      );

      Alert.alert('Success', 'Note updated successfully!');
      router.back(); 
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update note.';
      Alert.alert('Error', errorMessage);
      console.error('Note Update Error:', error);
    } finally {
      setIsUpdating(false);
    }
};

  // --- 6. Loading UI ---
  if (loading || !formData) {
    return (
        <SafeAreaView style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 10 }}>{loading ? "Loading Note..." : "Note Not Found"}</Text>
        </SafeAreaView>
    );
  }

  // --- 7. Main UI ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} disabled={isUpdating}>
                <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Edit Note</Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Give your note a title..."
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholderTextColor="#999"
              editable={!isUpdating}
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
              editable={!isUpdating}
            />
          </View>
        </ScrollView>
        
        {/* Update Button */}
        <TouchableOpacity 
          style={[styles.updateButton, isUpdating && styles.disabledButton]}
          onPress={handleUpdateNote}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- 8. Styling ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingVertical: 10,
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    formContainer: {
        paddingBottom: 20,
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
        minHeight: 200, 
        textAlignVertical: 'top', 
        paddingTop: 15,
    },
    updateButton: {
        backgroundColor: '#28a745', // Green color for update/save
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: Platform.OS === 'ios' ? 10 : 20,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#90ee90',
    }
});