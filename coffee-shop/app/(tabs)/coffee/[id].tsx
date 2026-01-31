import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore, COFFEE_DATA, CoffeeSize } from '../../../store/useStore';

const COLORS = {
  primary: '#D17842',
  secondary: '#252A32',
  background: '#0C0F14',
  text: '#FFFFFF',
  textSecondary: '#52555A',
};

export default function CoffeeDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToCart, isFavorite, toggleFavorite } = useStore();
  const [size, setSize] = useState<CoffeeSize>('M');
  const [qty, setQty] = useState(1);

  const item = useMemo(() => {
    const id = typeof params.id === 'string' ? params.id : '';
    return COFFEE_DATA.find(c => c.id === id) || COFFEE_DATA[0];
  }, [params.id]);

  const fav = isFavorite(item.id);

  const handleAddToCart = () => {
    addToCart(item, size, qty);
    Alert.alert('Added to Cart', `${item.name} (${size}) x${qty}`);
  };

  const incrementQty = () => setQty(q => q + 1);
  const decrementQty = () => setQty(q => (q > 1 ? q - 1 : 1));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.name}</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => toggleFavorite(item.id)}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? COLORS.primary : COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageWrap}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <Ionicons name="cafe" size={80} color={COLORS.textSecondary} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Descriptions</Text>
        <Text style={styles.desc}>
          A cappuccino is an Italian coffee drink that is traditionally prepared with equal parts double espresso,
          steamed milk, and steamed milk foam on top.
        </Text>

        <View style={styles.sizeRow}>
          {(['S', 'M', 'L'] as const).map(s => {
            const active = size === s;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setSize(s)}
                style={[styles.sizePill, active && styles.sizePillActive]}
              >
                <Text style={[styles.sizeText, active && { color: '#0C0F14' }]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={decrementQty}>
            <Ionicons name="remove" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{String(qty).padStart(2, '0')}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={incrementQty}>
            <Ionicons name="add" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={handleAddToCart}>
          <Text style={styles.ctaText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  imageWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 18, paddingBottom: 8 },
  image: { width: 260, height: 200, resizeMode: 'contain' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  desc: { color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 18 },
  sizeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  sizePill: { flex: 1, height: 34, borderRadius: 12, backgroundColor: '#2D2F36', alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
  sizePillActive: { backgroundColor: COLORS.primary },
  sizeText: { color: COLORS.text, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  qtyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  qtyText: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginHorizontal: 20 },
  cta: { marginTop: 'auto', backgroundColor: COLORS.primary, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
