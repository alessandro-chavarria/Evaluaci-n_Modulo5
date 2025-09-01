import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function EditProfileScreen() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    especialidad: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Especialidades disponibles
  const especialidades = [
    'Desarrollo de Software',
    'Redes y Telecomunicaciones',
    'Diseño Gráfico',
    'Contabilidad',
    'Secretariado',
  ];

  // Cargar datos del usuario al inicializar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData({
              nombre: userData.nombre || '',
              email: userData.email || '',
              edad: userData.edad?.toString() || '',
              especialidad: userData.especialidad || '',
            });
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Función para actualizar campos del formulario
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para validar el formulario
  const validateForm = () => {
    const { nombre, edad, especialidad } = formData;
    
    if (!nombre || !edad || !especialidad) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios');
      return false;
    }

    if (isNaN(edad) || parseInt(edad) < 15 || parseInt(edad) > 100) {
      Alert.alert('Error', 'Por favor, ingresa una edad válida');
      return false;
    }

    return true;
  };

  // Función para guardar cambios
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Actualizar documento en Firestore
        await updateDoc(doc(db, 'usuarios', user.uid), {
          nombre: formData.nombre,
          edad: parseInt(formData.edad),
          especialidad: formData.especialidad,
          fechaActualizacion: new Date().toISOString(),
        });

        Alert.alert(
          'Éxito', 
          'Tu información ha sido actualizada correctamente',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      Alert.alert('Error', 'No se pudo actualizar la información. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // Función para restablecer cambios
  const handleReset = () => {
    Alert.alert(
      'Restablecer Cambios',
      '¿Estás seguro de que deseas descartar todos los cambios?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            // Recargar datos originales
            setLoading(true);
            const fetchUserData = async () => {
              try {
                const user = auth.currentUser;
                if (user) {
                  const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setFormData({
                      nombre: userData.nombre || '',
                      email: userData.email || '',
                      edad: userData.edad?.toString() || '',
                      especialidad: userData.especialidad || '',
                    });
                  }
                }
              } catch (error) {
                console.error('Error al recargar datos:', error);
              } finally {
                setLoading(false);
              }
            };
            fetchUserData();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.formContainer}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {formData.nombre.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
              <Text style={styles.avatarSubtext}>Tu perfil</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              {/* Campo de nombre */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Ionicons name="person-outline" size={16} color="#666666" /> 
                  {' '}Nombre completo *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre completo"
                  value={formData.nombre}
                  onChangeText={(value) => updateFormData('nombre', value)}
                />
              </View>

              {/* Campo de correo (solo lectura) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Ionicons name="mail-outline" size={16} color="#666666" /> 
                  {' '}Correo electrónico
                </Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={formData.email}
                  editable={false}
                />
                <Text style={styles.helperText}>
                  El correo electrónico no se puede modificar
                </Text>
              </View>

              {/* Campo de edad */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Ionicons name="calendar-outline" size={16} color="#666666" /> 
                  {' '}Edad *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu edad"
                  value={formData.edad}
                  onChangeText={(value) => updateFormData('edad', value)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              {/* Selector de especialidad */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Ionicons name="school-outline" size={16} color="#666666" /> 
                  {' '}Especialidad *
                </Text>
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
              </View>

              {/* Texto de campos obligatorios */}
              <Text style={styles.requiredText}>
                * Campos obligatorios
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Ionicons 
              name={saving ? "sync-outline" : "save-outline"} 
              size={20} 
              color="#ffffff" 
            />
            <Text style={styles.saveButtonText}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  resetButton: {
    padding: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  avatarSubtext: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#666666',
  },
  helperText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 5,
    fontStyle: 'italic',
  },
  pickerContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  picker: {
    height: 50,
  },
  requiredText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionButtons: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});