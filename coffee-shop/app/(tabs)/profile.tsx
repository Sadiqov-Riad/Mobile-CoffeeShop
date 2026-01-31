import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../store/AuthProvider';
import { useStore } from '../../store/useStore';

const COLORS = {
  primary: '#D17842',
  secondary: '#252A32',
  background: '#0C0F14',
  text: '#FFFFFF',
  textSecondary: '#52555A',
};

type MenuItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: 'logout';
};

const MENU_ITEMS: MenuItem[] = [
  { id: '0', title: 'Personal Info', icon: 'person-outline', route: '/personal-info' },
  { id: '1', title: 'Address', icon: 'location-outline', route: '/address' },
  { id: '2', title: 'Card Information', icon: 'card-outline', route: '/payment-method' },
  { id: '3', title: 'Logout', icon: 'log-out-outline', action: 'logout' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { getProfilePhoto, setProfilePhoto } = useStore();
  const { user, logout } = useAuth();
  const photoUri = getProfilePhoto();

  async function ensureLibraryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert('Permission required', 'Media library permission is required to pick a photo.');
      return false;
    }
    return true;
  }

  async function pickProfilePhoto() {
    const ok = await ensureLibraryPermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;

    const uri = result.assets[0]?.uri ?? null;
    if (uri) {
      await setProfilePhoto(uri);
    }
  }

  async function deleteProfilePhoto() {
    Alert.alert('Delete Photo', 'Are you sure you want to remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setProfilePhoto(null) },
    ]);
  }

  async function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive', 
        onPress: async () => {
          await logout();
          router.replace('/signin');
        } 
      },
    ]);
  }

  function handleMenuPress(item: MenuItem) {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.route) {
      router.push(item.route as any);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Profile</Text>

      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickProfilePhoto} style={styles.avatarWrapper}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={36} color={COLORS.textSecondary} />
              </View>
            )}
            <TouchableOpacity
              onPress={photoUri ? deleteProfilePhoto : pickProfilePhoto}
              style={[styles.actionIcon, photoUri && styles.actionIconDanger]}
            >
              <Ionicons name={photoUri ? 'trash' : 'camera'} size={14} color={COLORS.text} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      <FlatList
        data={MENU_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
          >
            <View style={styles.menuRow}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, paddingTop: 60 },
  headerTitle: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileInfo: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { flexDirection: 'row', alignItems: 'flex-end' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.secondary },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  actionIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconDanger: { backgroundColor: '#ff6b6b' },
  name: { fontSize: 18, color: COLORS.text, fontWeight: 'bold', marginTop: 10 },
  email: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
});