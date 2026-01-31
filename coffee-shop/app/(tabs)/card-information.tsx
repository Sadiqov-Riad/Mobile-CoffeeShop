import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { z } from 'zod';

import { getCardInformation, setCardInformation } from '../../store/cardInfoStorage';

const COLORS = {
	primary: '#D17842',
	secondary: '#252A32',
	background: '#0C0F14',
	card: '#141921',
	text: '#FFFFFF',
	textSecondary: '#52555A',
	error: '#FF6B6B',
};

const cardSchema = z.object({
	cardNumber: z
		.string()
		.min(1, 'Card number is required')
		.refine((value) => /^\d{16}$/.test(value.replace(/\s+/g, '')), 'Card number must be 16 digits'),
	cardHolderName: z
		.string()
		.min(2, 'Card holder name is required')
		.max(64, 'Name is too long'),
	expiryDate: z
		.string()
		.min(1, 'Expiry date is required')
		.regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, 'Use MM/YY format'),
	cvv: z
		.string()
		.min(1, 'CVV is required')
		.refine((value) => /^\d{3,4}$/.test(value), 'CVV must be 3 or 4 digits'),
});

type CardFormValues = z.infer<typeof cardSchema>;

function formatCardNumber(input: string) {
	const digitsOnly = input.replace(/\D+/g, '').slice(0, 16);
	return digitsOnly.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input: string) {
	const digitsOnly = input.replace(/\D+/g, '').slice(0, 4);
	if (digitsOnly.length <= 2) return digitsOnly;
	return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
}

export default function CardInformationScreen() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const defaultValues = useMemo<CardFormValues>(
		() => ({
			cardNumber: '',
			cardHolderName: '',
			expiryDate: '',
			cvv: '',
		}),
		[]
	);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<CardFormValues>({
		resolver: zodResolver(cardSchema),
		defaultValues,
		mode: 'onChange',
	});

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const stored = await getCardInformation();
				if (mounted && stored) {
					reset({
						cardNumber: stored.cardNumber ?? '',
						cardHolderName: stored.cardHolderName ?? '',
						expiryDate: stored.expiryDate ?? '',
						cvv: stored.cvv ?? '',
					});
				}
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [reset]);


	const onSubmit = async (values: CardFormValues) => {
		setSaving(true);
		try {
			await setCardInformation({
				cardNumber: values.cardNumber,
				cardHolderName: values.cardHolderName,
				expiryDate: values.expiryDate,
				cvv: values.cvv,
			});
			Alert.alert('Saved', 'Card information saved successfully.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
					<Ionicons name="chevron-back" size={24} color={COLORS.text} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Card Information</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
				{loading ? (
					<Text style={styles.label}>Loading...</Text>
				) : (
					<>
						<Text style={styles.label}>Card Number</Text>
						<Controller
							control={control}
							name="cardNumber"
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									style={[styles.input, errors.cardNumber && styles.inputError]}
									placeholder="0000 0000 0000 0000"
									placeholderTextColor={COLORS.textSecondary}
									onBlur={onBlur}
									keyboardType="number-pad"
									autoCapitalize="none"
									value={value}
									onChangeText={(text) => onChange(formatCardNumber(text))}
								/>
							)}
						/>
						{!!errors.cardNumber && <Text style={styles.error}>{errors.cardNumber.message}</Text>}

						<Text style={[styles.label, { marginTop: 14 }]}>Card Holder Name</Text>
						<Controller
							control={control}
							name="cardHolderName"
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									style={[styles.input, errors.cardHolderName && styles.inputError]}
									placeholder="John Doe"
									placeholderTextColor={COLORS.textSecondary}
									onBlur={onBlur}
									autoCapitalize="words"
									value={value}
									onChangeText={onChange}
								/>
							)}
						/>
						{!!errors.cardHolderName && (
							<Text style={styles.error}>{errors.cardHolderName.message}</Text>
						)}

						<View style={styles.row}>
							<View style={{ flex: 1 }}>
								<Text style={[styles.label, { marginTop: 14 }]}>Expiry Date</Text>
								<Controller
									control={control}
									name="expiryDate"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											style={[styles.input, errors.expiryDate && styles.inputError]}
											placeholder="MM/YY"
											placeholderTextColor={COLORS.textSecondary}
											onBlur={onBlur}
											keyboardType="number-pad"
											value={value}
											onChangeText={(text) => onChange(formatExpiry(text))}
										/>
									)}
								/>
								{!!errors.expiryDate && <Text style={styles.error}>{errors.expiryDate.message}</Text>}
							</View>

							<View style={{ width: 12 }} />

							<View style={{ flex: 1 }}>
								<Text style={[styles.label, { marginTop: 14 }]}>CVV</Text>
								<Controller
									control={control}
									name="cvv"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											style={[styles.input, errors.cvv && styles.inputError]}
											placeholder="3 digits"
											placeholderTextColor={COLORS.textSecondary}
											onBlur={onBlur}
											keyboardType="number-pad"
											secureTextEntry
											maxLength={4}
											value={value}
											onChangeText={(text) => onChange(text.replace(/\D+/g, '').slice(0, 4))}
										/>
									)}
								/>
								{!!errors.cvv && <Text style={styles.error}>{errors.cvv.message}</Text>}
							</View>
						</View>

						<TouchableOpacity
							onPress={handleSubmit(onSubmit)}
							disabled={saving}
							style={[styles.payBtn, saving && { opacity: 0.7 }]}
						>
							<Text style={styles.payBtnText}>
								{saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save'}
							</Text>
						</TouchableOpacity>
					</>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.background },
	header: {
		paddingTop: 56,
		paddingHorizontal: 20,
		paddingBottom: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: COLORS.secondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
	content: { padding: 20, paddingBottom: 40 },
	label: { color: COLORS.text, fontSize: 13, fontWeight: '600', marginBottom: 8 },
	input: {
		backgroundColor: COLORS.card,
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		color: COLORS.text,
		borderWidth: 1,
		borderColor: 'transparent',
	},
	inputError: { borderColor: COLORS.error },
	error: { color: COLORS.error, marginTop: 6, fontSize: 12 },
	row: { flexDirection: 'row', alignItems: 'flex-start' },
	payBtn: {
		marginTop: 18,
		backgroundColor: COLORS.primary,
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	payBtnText: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
});
