
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        {/* Existing management dashboard pages */}
        <Stack.Screen name="bookings" />
        <Stack.Screen name="operations" />
        <Stack.Screen name="guests" />
        <Stack.Screen name="financials" />
        <Stack.Screen name="recommendations" />
        <Stack.Screen name="implementation" />

        {/* Customer booking journey */}
        <Stack.Screen name="customer" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="booking-success" />
        <Stack.Screen name="my-bookings" />

        {/* Hotel manager reservations */}
        <Stack.Screen name="reservations" />
      </Stack>
    </>
  );
}
