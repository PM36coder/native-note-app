import { AuthProvider, useAuth } from "@/assets/components/context/context";
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
 function ProtectedStack() {
  const {user} = useAuth()
  return(
  <SafeAreaProvider>
  <Stack screenOptions={{headerShown:false}}>
    
    

    {user ? <>
    <Stack.Screen name="(tabs)"  />
    <Stack.Screen 
      name="edit-note/[id]"
      options={{
        title: 'Edit Note',
        headerShown: true,
        presentation: 'modal'
      }}
    />
    </>:<>
    
    <Stack.Screen name="index"/>
    <Stack.Screen name="(auth)"/>
   
    </>}
    
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