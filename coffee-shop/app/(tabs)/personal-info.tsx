import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../store/AuthProvider';

const COLORS = {
  primary: '#D17842',
  secondary: '#252A32',
  background: '#0C0F14',
  text: '#FFFFFF',
  textSecondary: '#52555A',
};

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, isLoading, updateName } = useAuth() as any;
  const [name, setName] = useState(user?.name ?? '');

  useEffect(() => {
    setName(user?.name ?? '');
  }, [user?.name]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    const ok = await updateName(name);
    if (ok) {
      Alert.alert('Saved', 'Your name has been updated.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.leftIcon}>
            <Ionicons name="person" size={18} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={!isLoading}
              placeholder="Name"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.leftIcon}>
            <Ionicons name="mail" size={18} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={user?.email ?? ''}
              editable={false}
              placeholder="Email"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="none"
            />
          </View>
        </View>

        <Text style={styles.hint}>These fields come from your account.</Text>

        <TouchableOpacity
          style={[styles.saveBtn, isLoading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveBtnText}>Save</Text>
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
  hint: { color: COLORS.textSecondary, fontSize: 12, marginTop: 10, textAlign: 'center' },
  saveBtn: { backgroundColor: COLORS.primary, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
