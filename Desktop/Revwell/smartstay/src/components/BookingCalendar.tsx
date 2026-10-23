
import React from "react";
import { TextInput, StyleSheet } from "react-native";

type Props = {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
};

export default function BookingCalendar({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
}: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#8994A4"
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#DCE2E9",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 9,
    color: "#10233F",
    fontSize: 15,
  },
});
