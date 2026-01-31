import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COFFEE_DATA, useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');
const COLORS = { primary: '#D17842', secondary: '#252A32', background: '#0C0F14', text: '#FFFFFF', textSecondary: '#52555A' };

const CATEGORIES = ['All', 'Cappuccino', 'Latte', 'Espresso', 'Americano', 'Mocha', 'Cold Brew'];

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart, getProfilePhoto } = useStore();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState('');
  const profilePhoto = getProfilePhoto();

  const data = useMemo(() => {
    let items =
      activeCategory === 'All'
        ? COFFEE_DATA
        : COFFEE_DATA.filter(i => i.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return items;
  }, [activeCategory, search]);

  const handleQuickAdd = (item: (typeof COFFEE_DATA)[0]) => {
    addToCart(item, 'M', 1);
    Alert.alert('Added!', `${item.name} (M) added to cart`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeftSpacer} />

        <Text style={styles.headerTitle}>
          Coffee<Text style={{ color: COLORS.primary }}>Shop</Text>
        </Text>

        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={18} color={COLORS.textSecondary} />
          </View>
        )}
      </View>

      <Text style={styles.heading}>Find the best{'\n'}coffee for you</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#52555A" />
        <TextInput
          placeholder="Find Your Coffee..."
          placeholderTextColor="#52555A"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat, index) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveCategory(cat)}
              style={[styles.categoryPill, active && styles.categoryPillActive]}
            >
              <Text style={[styles.categoryText, active && { color: COLORS.primary }]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ color: COLORS.textSecondary, textAlign: 'center', marginTop: 30 }}>No coffee found</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/coffee/[id]', params: { id: item.id } })}
          >
            <View style={styles.cardImageWrap}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.cardImageInner} />
              ) : (
                <Ionicons name="cafe" size={40} color={COLORS.textSecondary} />
              )}
            </View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => handleQuickAdd(item)}>
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerLeftSpacer: { width: 38, height: 38 },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '600' },
  avatar: { width: 38, height: 38, borderRadius: 14, backgroundColor: COLORS.secondary },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 28, color: COLORS.text, fontWeight: 'bold', marginBottom: 20 },
  searchContainer: { flexDirection: 'row', backgroundColor: COLORS.secondary, borderRadius: 15, padding: 10, alignItems: 'center' },
  searchInput: { flex: 1, color: COLORS.text, marginLeft: 10 },
  categories: { marginTop: 22, marginBottom: 18, maxHeight: 54 },
  categoriesContent: { alignItems: 'center', paddingVertical: 8 },
  categoryPill: { height: 32, paddingHorizontal: 14, borderRadius: 16, backgroundColor: '#141921', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  categoryPillActive: { backgroundColor: '#141921' },
  categoryText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: COLORS.secondary, borderRadius: 20, padding: 12, width: (width - 20 * 2 - 14) / 2, marginBottom: 14 },
  cardImageWrap: { width: '100%', height: 110, borderRadius: 15, marginBottom: 10, backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardImageInner: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardTitle: { color: COLORS.text, fontSize: 16 },
  cardSubtitle: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: 8, padding: 5 },
});