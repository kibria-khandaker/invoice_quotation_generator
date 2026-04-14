// src/screens/HomeScreen.js

import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Create Quotation"
        onPress={() => navigation.navigate('Create')}
      />
    </View>
  );
}