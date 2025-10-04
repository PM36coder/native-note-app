import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="login" options={{animation: 'slide_from_right' , animationDuration:3000}}/>
    <Stack.Screen name="register" options={{animation: 'fade_from_bottom'}}/>
  </Stack>;
}