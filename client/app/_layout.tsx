import { AuthProvider, useAuth } from "@/assets/components/context/context";
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from "react-native"; // Loading ke liye

// --- 1. User/Loading Status Check ---
function ProtectedStack() {
  // Assuming 'loading' state is also available from useAuth
  const { user, loading } = useAuth(); 

  // Agar user/token data load ho raha hai, toh loading screen dikhao.
  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaProvider>
    );
  }

  // --- 2. Conditional Stack Rendering ---
  // Agar user logged in hai, toh protected screens dikhao
  if (user) {
    return (
      <SafeAreaProvider>
        {/* Protected Screens Stack */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings" />
          <Stack.Screen 
            name="edit-note/[id]"
            options={{
              title: 'Edit Note',
              headerShown: true,
              presentation: 'modal'
            }}
          />
          {/* Note: Ab yahan koi conditional logic nahi hai, sirf Stack.Screen hain */}
        </Stack>
      </SafeAreaProvider>
    );
  } 
  
  // Agar user logged out hai, toh public screens dikhao
  return (
    <SafeAreaProvider>
      {/* Public/Auth Screens Stack */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen  name="(auth)" />
      </Stack>
    </SafeAreaProvider>
  );
}

// --- 3. Main Export ---
export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedStack />
    </AuthProvider>
  );
}