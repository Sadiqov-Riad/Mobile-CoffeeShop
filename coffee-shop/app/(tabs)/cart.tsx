import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCardInformation } from '../../store/cardInfoStorage';
import { CartItem, useStore } from '../../store/useStore';

const COLORS = {
	primary: '#D17842',
	secondary: '#252A32',
	background: '#0C0F14',
	text: '#FFFFFF',
	textSecondary: '#52555A',
};

export default function CartScreen() {
	const router = useRouter();
	const { getCart, getCartTotal, updateCartQuantity, removeFromCart, clearCart } = useStore();
	const cart = getCart();
	const total = getCartTotal();

	const handleCheckout = async () => {
		if (cart.length === 0) return;

		const cardInfo = await getCardInformation();
		
		if (cardInfo && cardInfo.cardNumber) {
			clearCart();
			router.push('/order-confirmation');
		} else {
			router.push({ pathname: '/checkout-payment-method', params: { total: total.toString() } });
		}
	};

	if (cart.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={styles.headerTitle}>Cart</Text>
				<View style={styles.emptyWrap}>
					<View style={styles.iconCircle}>
						<Ionicons name="cart-outline" size={28} color={COLORS.primary} />
					</View>
					<Text style={styles.emptyTitle}>Your cart is empty</Text>
					<Text style={styles.emptySubtitle}>Add something tasty from Home.</Text>
					<TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
						<Text style={styles.buttonText}>Browse coffee</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	const renderItem = ({ item }: { item: CartItem }) => (
		<View style={styles.card}>
			<View style={styles.imagePlaceholder}>
				{item.imageUri ? (
					<Image source={{ uri: item.imageUri }} style={styles.image} />
				) : (
					<Ionicons name="cafe" size={28} color={COLORS.textSecondary} />
				)}
			</View>
			<View style={{ flex: 1 }}>
				<Text style={styles.title}>{item.name}</Text>
				<Text style={styles.subtitle}>Size: {item.size}</Text>
				<Text style={styles.price}>$ {(item.price * item.quantity).toFixed(2)}</Text>
			</View>
			<View style={styles.qtyControls}>
				<TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQuantity(item.id, item.size, -1)}>
					<Ionicons name="remove" size={16} color={COLORS.text} />
				</TouchableOpacity>
				<Text style={styles.qtyText}>{item.quantity}</Text>
				<TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQuantity(item.id, item.size, 1)}>
					<Ionicons name="add" size={16} color={COLORS.text} />
				</TouchableOpacity>
			</View>
			<TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id, item.size)}>
				<Ionicons name="trash-outline" size={18} color="#ff6b6b" />
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.headerTitle}>Cart</Text>

			<FlatList
				data={cart}
				keyExtractor={(item, idx) => `${item.id}-${item.size}-${idx}`}
				contentContainerStyle={{ paddingTop: 14, paddingBottom: 100 }}
				ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
				renderItem={renderItem}
			/>

			<View style={styles.footer}>
				<View>
					<Text style={styles.totalLabel}>Total</Text>
					<Text style={styles.totalValue}>$ {total.toFixed(2)}</Text>
				</View>
				<TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
					<Text style={styles.checkoutText}>Checkout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.background, padding: 20, paddingTop: 60 },
	headerTitle: { fontSize: 20, color: COLORS.text, fontWeight: 'bold', textAlign: 'center' },
	emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	iconCircle: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
	emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginTop: 8 },
	emptySubtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
	button: { marginTop: 16, backgroundColor: COLORS.primary, height: 48, paddingHorizontal: 22, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
	buttonText: { color: '#fff', fontWeight: '700' },

	card: { backgroundColor: COLORS.secondary, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center' },
	imagePlaceholder: { width: 60, height: 60, borderRadius: 14, backgroundColor: '#1E1E1E', marginRight: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
	image: { width: '100%', height: '100%', resizeMode: 'cover' },
	title: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
	subtitle: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
	price: { color: COLORS.primary, marginTop: 6, fontWeight: '700' },
	qtyControls: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
	qtyBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center' },
	qtyText: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginHorizontal: 8 },
	removeBtn: { padding: 6 },

	footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: '#1E1E1E', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	totalLabel: { color: COLORS.textSecondary, fontSize: 12 },
	totalValue: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
	checkoutBtn: { backgroundColor: COLORS.primary, height: 50, paddingHorizontal: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
	checkoutText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
