import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const COLORS = {
  primary: '#D17842',
  background: '#0C0F14',
  tabBar: '#0C0F14', 
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopWidth: 0,
          height: 68,
          paddingBottom: 12,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#52555A',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
              <View
                style={{
                  marginTop: 6,
                  height: 4,
                  width: 18,
                  borderRadius: 2,
                  backgroundColor: focused ? COLORS.primary : 'transparent',
                }}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen name="personal-info" options={{ href: null }} />
      <Tabs.Screen name="address" options={{ href: null }} />
      <Tabs.Screen name="payment-method" options={{ href: null }} />
      <Tabs.Screen name="card-information" options={{ href: null }} />
      <Tabs.Screen name="checkout-payment-method" options={{ href: null }} />
      <Tabs.Screen name="checkout-card-info" options={{ href: null }} />
      <Tabs.Screen name="order-confirmation" options={{ href: null }} />
      <Tabs.Screen name="coffee/[id]" options={{ href: null }} />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
              <View
                style={{
                  marginTop: 6,
                  height: 4,
                  width: 18,
                  borderRadius: 2,
                  backgroundColor: focused ? COLORS.primary : 'transparent',
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
              <View
                style={{
                  marginTop: 6,
                  height: 4,
                  width: 18,
                  borderRadius: 2,
                  backgroundColor: focused ? COLORS.primary : 'transparent',
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
              <View
                style={{
                  marginTop: 6,
                  height: 4,
                  width: 18,
                  borderRadius: 2,
                  backgroundColor: focused ? COLORS.primary : 'transparent',
                }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}