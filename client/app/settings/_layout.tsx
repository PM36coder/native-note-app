import { Stack } from "expo-router";

export default function SettingLayout() {
  return <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="change-password" options={{animation: 'slide_from_right' , animationDuration:3000}}/>
    <Stack.Screen name="update-profile" options={{animation: 'fade_from_bottom'}}/>
  </Stack>;
}