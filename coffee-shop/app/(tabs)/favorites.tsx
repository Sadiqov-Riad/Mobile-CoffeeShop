import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';

const COLORS = {
	primary: '#D17842',
	secondary: '#252A32',
	background: '#0C0F14',
	text: '#FFFFFF',
	textSecondary: '#52555A',
};

export default function FavoritesScreen() {
	const router = useRouter();
	const { getFavorites, toggleFavorite } = useStore();
	const favorites = getFavorites();

	if (favorites.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={styles.headerTitle}>Favorites</Text>
				<View style={styles.emptyWrap}>
					<View style={styles.iconCircle}>
						<Ionicons name="heart-outline" size={28} color={COLORS.primary} />
					</View>
					<Text style={styles.emptyTitle}>No favorites yet</Text>
					<Text style={styles.emptySubtitle}>Tap the heart icon on any coffee to add it here.</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.headerTitle}>Favorites</Text>

			<FlatList
				data={favorites}
				keyExtractor={item => item.id}
				contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
				ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.card}
						onPress={() => router.push({ pathname: '/coffee/[id]', params: { id: item.id } })}
					>
						<View style={styles.imagePlaceholder}>
							{item.imageUri ? (
								<Image source={{ uri: item.imageUri }} style={styles.image} />
							) : (
								<Ionicons name="cafe" size={32} color={COLORS.textSecondary} />
							)}
						</View>
						<View style={{ flex: 1 }}>
							<Text style={styles.title}>{item.name}</Text>
							<Text style={styles.subtitle}>{item.description}</Text>
							<Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
						</View>

						<TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item.id)}>
							<Ionicons name="heart" size={18} color={COLORS.primary} />
						</TouchableOpacity>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.background, padding: 20, paddingTop: 60 },
	headerTitle: { fontSize: 20, color: COLORS.text, fontWeight: 'bold', textAlign: 'center' },
	emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	iconCircle: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
	emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginTop: 12 },
	emptySubtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4, textAlign: 'center' },
	card: {
		backgroundColor: COLORS.secondary,
		borderRadius: 20,
		padding: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	imagePlaceholder: { width: 74, height: 74, borderRadius: 18, backgroundColor: '#1E1E1E', marginRight: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
	image: { width: '100%', height: '100%', resizeMode: 'cover' },
	title: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
	subtitle: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
	price: { color: COLORS.text, marginTop: 10, fontWeight: '700' },
	heartBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#141921', alignItems: 'center', justifyContent: 'center' },
});

