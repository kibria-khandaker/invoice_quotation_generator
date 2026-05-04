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
      <View style={{ height: 10 }} />
      <Button
        title="View Quotation History"
        onPress={() => navigation.navigate('History')}
      />
    </View>
  );
}