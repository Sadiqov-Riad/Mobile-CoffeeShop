import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false, // Скрываем стандартный заголовок на всех экранах
          contentStyle: { backgroundColor: '#000' }, // Базовый цвет фона
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="signin" />
      </Stack>
    </>
  );
}