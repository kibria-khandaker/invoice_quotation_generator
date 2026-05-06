import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CreateQuotationScreen from '../screens/CreateQuotationScreen';
import PreviewScreen from '../screens/PreviewScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CompanySettingsScreen from '../screens/CompanySettingsScreen';
import ClientSettingsScreen from '../screens/ClientSettingsScreen';
import ItemsCatalogSettingsScreen from '../screens/ItemsCatalogSettingsScreen';
import PaymentSettingsScreen from '../screens/PaymentSettingsScreen';
import MobilePaymentSettingsScreen from '../screens/MobilePaymentSettingsScreen';
import SignatureSettingsScreen from '../screens/SignatureSettingsScreen';
import NotesSettingsScreen from '../screens/NotesSettingsScreen';

import AboutUsScreen from '../screens/AboutUsScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import CreateInvoiceScreen from '../screens/CreateInvoiceScreen';
import InvoiceHistoryScreen from '../screens/InvoiceHistoryScreen';
import DraftQuotationScreen from '../screens/DraftQuotationScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Create"
          component={CreateQuotationScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Preview"
          component={PreviewScreen}
          // options={{ title: 'Preview Quotation' }}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Quotation History' }}
        />

        <Stack.Screen
          name="DraftQuotation"
          component={DraftQuotationScreen}
          options={{ title: 'Draft Quotations' }}
        />
        
        <Stack.Screen
          name="CreateInvoice"
          component={CreateInvoiceScreen}
          options={{ title: 'Create Invoice' }}
        />

        <Stack.Screen
          name="InvoiceHistory"
          component={InvoiceHistoryScreen}
          options={{ title: 'Invoice History' }}
        />

        <Stack.Screen
          name="AboutUs"
          component={AboutUsScreen}
          options={{ title: 'About Us' }}
        />

        <Stack.Screen
          name="TermsConditions"
          component={TermsConditionsScreen}
          options={{ title: 'Terms & Conditions' }}
        />

        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ title: 'Privacy Policy' }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        
<Stack.Screen
  name="CompanySettings"
  component={CompanySettingsScreen}
  options={{ title: 'Company Information' }}
/>
<Stack.Screen
  name="ClientSettings"
  component={ClientSettingsScreen}
  options={{ title: 'Client Profiles' }}
/>
<Stack.Screen
  name="ItemsCatalogSettings"
  component={ItemsCatalogSettingsScreen}
  options={{ title: 'Items Catalog' }}
/>
<Stack.Screen
  name="PaymentSettings"
  component={PaymentSettingsScreen}
  options={{ title: 'Payment Terms & Method' }}
/>

<Stack.Screen
  name="MobilePaymentSettings"
  component={MobilePaymentSettingsScreen}
  options={{ title: 'Mobile Payment Info' }}
/>

<Stack.Screen
  name="SignatureSettings"
  component={SignatureSettingsScreen}
  options={{ title: 'Signature' }}
/>

<Stack.Screen
  name="NotesSettings"
  component={NotesSettingsScreen}
  options={{ title: 'Notes' }}
/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}