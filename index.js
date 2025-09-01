import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

// Registrar el componente principal de la aplicación
registerRootComponent(App);

// Para compatibilidad con React Native CLI (opcional)
AppRegistry.registerComponent('main', () => App);

// Configuración adicional para desarrollo
if (__DEV__) {
  console.log('🚀 Aplicación iniciada en modo desarrollo');
  console.log('📱 App: Evaluación Módulo 5 - React Native + Firebase');
}