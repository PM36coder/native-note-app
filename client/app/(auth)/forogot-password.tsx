import React, { useState } from 'react';
import { 
//   View, 
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
import API from '@/assets/components/axios/axios'; // Assuming your Axios instance path

// --- State Management for the multi-step process ---
type Step = 'EMAIL' | 'OTP' | 'RESET';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- 1. Send OTP Step Handler ---
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // API call to your backend: router.post('/send-otp', sendOtpUser)
      const response = await API.post('/send-otp', { email });

      setMessage(response.data.message || 'OTP sent to your email.');
      setStep('OTP'); // Success par next step
      Alert.alert('Success', 'OTP has been sent to your email.');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please check your email.';
      Alert.alert('Error', errorMessage);
      console.error('Send OTP Error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Verify OTP & Prepare for Reset (OTP Step) ---
  const handleOtpVerification = () => {
    if (!otp || otp.length !== 6) {
        Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
        return;
    }
    // We don't verify the OTP here via API. We move to the RESET step 
    // and let the final API call (/reset-password) handle the verification.
    setStep('RESET');
    setMessage('Enter your new password below.');
  };
  

  // --- 3. Reset Password Step Handler ---
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 8) {
        Alert.alert('Error', 'New password must be at least 8 characters long.');
        return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // API call to your backend: router.post('/reset-password', resetUserPassword)
      const response = await API.post('/reset-password', {
        email,
        otp,
        newPassword,
      });

      Alert.alert(
        'Success!', 
        response.data.message || 'Password reset successfully. You can now log in.',
        [
            // Success par login screen par bhej dena
            { text: "OK", onPress: () => router.replace('/(auth)/login') }
        ]
      );
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. OTP might be invalid or expired.';
      Alert.alert('Error', errorMessage);
      setMessage(errorMessage);
      console.error('Reset Password Error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };


  // --- UI RENDER LOGIC ---
  const renderContent = () => {
    if (step === 'EMAIL') {
      return (
        <>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset code.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSendOtp}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? <ActivityIndicator color="#fff" /> : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </>
      );
    } 
    
    else if (step === 'OTP') {
      return (
        <>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>A 6-digit code was sent to {email}.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleOtpVerification}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              Continue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => setStep('EMAIL')}
            disabled={isLoading}
          >
            <Text  onPress={() => setStep('EMAIL')} style={styles.linkButtonText}>Change Email</Text>
          </TouchableOpacity>
        </>
      );
    } 
    
    else if (step === 'RESET') {
      return (
        <>
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Your OTP is ready. Enter your new password.</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password (min 8 chars)"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? <ActivityIndicator color="#fff" /> : 'Reset Password'}
            </Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
                <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            
            {/* Status Message */}
            {message ? <Text style={styles.statusMessage}>{message}</Text> : null}

            {/* Render Step Content */}
            {renderContent()}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styling ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 40,
        flexGrow: 1,
    },
    backButtonContainer: {
        marginBottom: 20,
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    statusMessage: {
        fontSize: 14,
        color: 'green',
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007AFF', // Blue primary color
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 15,
        padding: 10,
        alignItems: 'center',
    },
    linkButtonText: {
        color: '#666',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});