
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CreateQuotationScreen from '../screens/CreateQuotationScreen';
import PreviewScreen from '../screens/PreviewScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Create" component={CreateQuotationScreen} options={{ title: 'Create Quotation' }} />
        <Stack.Screen name="Preview" component={PreviewScreen} options={{ title: 'Preview Quotation' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Quotation History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}