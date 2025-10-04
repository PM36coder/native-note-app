import { Stack } from "expo-router";
export default function LayoutNote() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{headerShown: true, title: "Edit Note"}} />
    </Stack>
  );
}