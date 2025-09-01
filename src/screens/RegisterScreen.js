import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    edad: '',
    especialidad: '',
  });
  const [loading, setLoading] = useState(false);

  // Especialidades disponibles
  const especialidades = [
    'Desarrollo de Software',
    'Redes y Telecomunicaciones',
    'Diseño Gráfico',
    'Contabilidad',
    'Secretariado',
  ];

  // Función para actualizar campos del formulario
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para validar el formulario
  const validateForm = () => {
    const { nombre, email, password, edad, especialidad } = formData;
    
    if (!nombre || !email || !password || !edad || !especialidad) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (isNaN(edad) || parseInt(edad) < 15 || parseInt(edad) > 100) {
      Alert.alert('Error', 'Por favor, ingresa una edad válida');
      return false;
    }

    return true;
  };

  // Función para registrar usuario
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Crear usuario con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // Guardar información adicional del usuario en Firestore
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        nombre: formData.nombre,
        email: formData.email,
        edad: parseInt(formData.edad),
        especialidad: formData.especialidad,
        fechaRegistro: new Date().toISOString(),
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      // La navegación se manejará automáticamente por el listener en App.js
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener mensajes de error en español
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado';
      case 'auth/invalid-email':
        return 'Correo electrónico inválido';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      default:
        return 'Error al registrar usuario. Intenta de nuevo.';
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          
          {/* Campo de nombre */}
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={formData.nombre}
            onChangeText={(value) => updateFormData('nombre', value)}
          />

          {/* Campo de correo electrónico */}
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo de contraseña */}
          <TextInput
            style={styles.input}
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry
          />

          {/* Campo de edad */}
          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={formData.edad}
            onChangeText={(value) => updateFormData('edad', value)}
            keyboardType="numeric"
          />

          {/* Selector de especialidad */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.especialidad}
              style={styles.picker}
              onValueChange={(value) => updateFormData('especialidad', value)}
            >
              <Picker.Item label="Selecciona tu especialidad" value="" />
              {especialidades.map((esp, index) => (
                <Picker.Item key={index} label={esp} value={esp} />
              ))}
            </Picker>
          </View>

          {/* Botón de registro */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>

          {/* Enlace para volver al login */}
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333',
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
  },
});