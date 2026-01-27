import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import IntroImage from '../assets/images/coffee/intro.svg';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.logoContainer}>
          <IntroImage width={150} height={150} />
          <Text style={styles.brandName}>CoffeeShop</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
             <TextInput
              style={styles.input}
              placeholder="admin@gmail.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
             />
          </View>
          
          <View style={styles.inputWrapper}>
             <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
             />
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Signin</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E252D',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  brandName: {
    fontSize: 24,
    color: '#EFEFEF',
    marginTop: 10,
    fontWeight: '600',
  },
  formContainer: {
    gap: 20,
  },
  inputWrapper: {
    backgroundColor: '#2A323C',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: {
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8D5839',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#8D5839',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
