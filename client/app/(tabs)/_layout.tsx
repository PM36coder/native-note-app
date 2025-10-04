import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons'; // Icons ke liye
import { Platform } from 'react-native';

// Tab bar ki styling (aap apne hisaab se badal sakte hain)
const tabOptions = {
  tabBarActiveTintColor: '#007AFF', // iOS blue
  tabBarInactiveTintColor: '#666',
  tabBarStyle: {
    backgroundColor: '#fff',
    borderTopColor: '#e0e0e0',
    height: Platform.OS === 'ios' ? 90 : 60, // iOS devices ke liye space
    paddingBottom: Platform.OS === 'ios' ? 20 : 5, // Icons ke liye padding
  },
  headerShown: false, // Hum har screen mein alag se header dikhayenge
};

export default function TabsLayout() {
  return (
    // Yeh Tabs component hi bottom tab bar banata hai
    <Tabs screenOptions={tabOptions}>
      
      {/* 1st Tab: Notes List (Home) */}
      <Tabs.Screen
        name="notes" // Yeh file ka naam hai: 'app/(tabs)/index.tsx' ya '.js'
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => (
            <Ionicons name="journal" size={24} color={color} />
          ),
          // Stack Navigation ko chhupane ke liye header hide karna
          headerShown: false,
        }}
      />

      {/* 2nd Tab: Create Note */}
      <Tabs.Screen
        name="create" // Yeh file ka naam hai: 'app/(tabs)/create.tsx' ya '.js'
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
      
      {/* 3rd Tab: Profile / Settings */}
      <Tabs.Screen
        name="profile" // Yeh file ka naam hai: 'app/(tabs)/profile.tsx' ya '.js'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      
     
      
    </Tabs>
  );
}