import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // В реальном приложении хранить хэш!
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

const USERS_STORAGE_KEY = 'users.v1';
const CURRENT_USER_KEY = 'currentUser.v1';

// ========== Работа с хранилищем пользователей ==========

export async function getAllUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

async function saveAllUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// ========== Регистрация ==========

export interface RegisterResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export async function registerUser(
  email: string,
  name: string,
  password: string
): Promise<RegisterResult> {
  const users = await getAllUsers();

  // Проверка: email уже существует?
  const emailLower = email.toLowerCase().trim();
  const existing = users.find((u) => u.email.toLowerCase() === emailLower);
  if (existing) {
    return { success: false, error: 'User with this email already exists' };
  }

  // Создаём нового пользователя
  const newUser: User = {
    id: Date.now().toString(),
    email: emailLower,
    name: name.trim(),
    password, // В реальном приложении использовать bcrypt/argon2!
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveAllUsers(users);

  const authUser: AuthUser = { id: newUser.id, email: newUser.email, name: newUser.name };
  return { success: true, user: authUser };
}

// ========== Аутентификация (логин) ==========

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const users = await getAllUsers();
  const emailLower = email.toLowerCase().trim();

  const user = users.find(
    (u) => u.email.toLowerCase() === emailLower && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const authUser: AuthUser = { id: user.id, email: user.email, name: user.name };
  return { success: true, user: authUser };
}

// ========== Сохранение/загрузка текущего пользователя (persist session) ==========

export async function saveCurrentUser(user: AuthUser | null): Promise<void> {
  if (user) {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
}

export async function loadCurrentUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

// ========== Update profile (name) ==========

export interface UpdateProfileResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export async function updateCurrentUserName(name: string): Promise<UpdateProfileResult> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { success: false, error: 'Name is required' };
  }

  const current = await loadCurrentUser();
  if (!current) {
    return { success: false, error: 'Not authenticated' };
  }

  // Update users list (so next login uses the new name)
  const users = await getAllUsers();
  const nextUsers = users.map((u) =>
    u.email.toLowerCase() === current.email.toLowerCase()
      ? { ...u, name: trimmed }
      : u
  );
  await saveAllUsers(nextUsers);

  const updated: AuthUser = { ...current, name: trimmed };
  await saveCurrentUser(updated);

  return { success: true, user: updated };
}
