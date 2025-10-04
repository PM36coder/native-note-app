import { AuthProvider, useAuth } from "@/assets/components/context/context";
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
 function ProtectedStack() {
  const {user} = useAuth()
  return(
  <SafeAreaProvider>
  <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="index"/>
    <Stack.Screen name="(auth)"/>
    {user && <Stack.Screen name="(tabs)"/>}
    
  </Stack>
  </SafeAreaProvider>)
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedStack />
    </AuthProvider>
  );
}