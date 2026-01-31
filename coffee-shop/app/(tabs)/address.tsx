import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../store/useStore';

const COLORS = {
  primary: '#D17842',
  secondary: '#252A32',
  background: '#0C0F14',
  text: '#FFFFFF',
  textSecondary: '#52555A',
};

export default function AddressScreen() {
  const router = useRouter();
  const { getAddress, updateAddress } = useStore();
  const addressData = getAddress();

  const [town, setTown] = useState(addressData.town);
  const [phone, setPhone] = useState(addressData.phone);

  const handleSave = () => {
    updateAddress({ town, phone });
    Alert.alert('Saved!', 'Your address has been updated.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.leftIcon}>
            <Ionicons name="navigate" size={18} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Town</Text>
            <TextInput
              style={styles.input}
              value={town}
              onChangeText={setTown}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.leftIcon}>
            <Ionicons name="call" size={18} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Call/Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  form: { marginTop: 30 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  leftIcon: { width: 40, alignItems: 'center' },
  label: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 4 },
  input: { color: COLORS.text, fontSize: 16, borderBottomWidth: 1, borderBottomColor: COLORS.secondary, paddingVertical: 6 },
  saveBtn: { backgroundColor: COLORS.primary, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
