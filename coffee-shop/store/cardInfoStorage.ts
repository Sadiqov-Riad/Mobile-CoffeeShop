import AsyncStorage from '@react-native-async-storage/async-storage';

export type CardInformation = {
	cardNumber: string; // may include spaces
	cardHolderName: string;
	expiryDate: string; // MM/YY
	cvv: string;
	updatedAt: string; // ISO
};

const STORAGE_KEY = 'cardInformation.v1';

export async function getCardInformation(): Promise<CardInformation | null> {
	const raw = await AsyncStorage.getItem(STORAGE_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as CardInformation;
	} catch {
		return null;
	}
}

export async function setCardInformation(
	data: Omit<CardInformation, 'updatedAt'>
): Promise<CardInformation> {
	const payload: CardInformation = {
		...data,
		updatedAt: new Date().toISOString(),
	};
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	return payload;
}
