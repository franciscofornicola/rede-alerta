import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import BoasVindas from './screens/BoasVindas';
import EscolhaRegiao from './screens/EscolhaRegiao';
import PainelGeral from './screens/PainelGeral';
import Relato from './screens/Relato';
import Dicas from './screens/Dicas';
import Historico from './screens/Historico';
import Perfil from './screens/Perfil';
import Mapa from './screens/Mapa';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Mapa') {
            iconName = focused ? 'map' : 'map';
          } else if (route.name === 'Relato') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Dicas') {
            iconName = focused ? 'lightbulb' : 'lightbulb-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3478F6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={PainelGeral} options={{ tabBarLabel: 'Inicio', headerShown: false }} />
      <Tab.Screen name="Mapa" component={Mapa} options={{ tabBarLabel: 'Mapa', headerShown: false }} />
      <Tab.Screen name="Relato" component={Relato} options={{ tabBarLabel: 'Relato', headerShown: false }} />
      <Tab.Screen name="Dicas" component={Dicas} options={{ tabBarLabel: 'Dicas', headerShown: false }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ tabBarLabel: 'Perfil', headerShown: false }} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="BoasVindas"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="BoasVindas" component={BoasVindas} />
          <Stack.Screen name="EscolhaRegiao" component={EscolhaRegiao} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Historico" component={Historico} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 