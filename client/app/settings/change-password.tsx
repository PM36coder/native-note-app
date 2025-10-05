import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import API from '@/assets/components/axios/axios';
import { useAuth } from '@/assets/components/context/context'; // Agar token use karna ho

export default function ChangePassword() {
  const router = useRouter();
  const { logout ,token} = useAuth(); // Logout use karenge agar password change ho gaya
  
 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Change Password Handler
  const handleChangePassword = async () => {
    // --- Validation ---
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    
    if (newPassword.length < 8) {
        Alert.alert('Error', 'New password must be at least 8 characters long.');
        return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }
    
    if (newPassword === currentPassword) {
        Alert.alert('Error', 'New password cannot be the same as the current password.');
        return;
    }

    setIsLoading(true);
    try {
      const data = {
        currentPassword,
        newPassword
      }
      // 3. API Call (PUT /change-password)
      const response = await API.put('/change-password',data, {
       headers:{
        "Authorization": `Bearer ${token}`
       }
      });

      // 4. Success Handling
      Alert.alert(
        'Success!', 
        response.data.message || 'Password updated successfully. Please log in again.',
        [
           
            { text: "OK", onPress: () => {
                logout(); // Logout user
                router.replace('/(auth)/login'); 
            }}
        ]
      );
      
    } catch (error: any) {
      // 5. Error Handling
      const errorMessage = error.response?.data?.message || 'Failed to change password. Check your current password.';
      Alert.alert('Error', errorMessage);
      console.error('Change Password Error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Layout ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Change Your Password</Text>
            <Text style={styles.subtitle}>Enter your current and new password to update your account security.</Text>

            {/* Current Password */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    editable={!isLoading}
                />
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Enter new password (min 8 chars)"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    editable={!isLoading}
                />
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!isLoading}
                />
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity 
                style={[styles.button, isLoading && styles.disabledButton]}
                onPress={handleChangePassword}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Update Password</Text>
                )}
            </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styling ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
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
    button: {
        backgroundColor: '#007AFF', // Blue primary color
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#90CAF9',
    }
});