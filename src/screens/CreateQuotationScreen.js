import { View, Text, Button } from 'react-native';

export default function CreateQuotationScreen({ navigation }) {
  return (
    <View>
      <Text>Create Quotation</Text>
      <Button
        title="Preview"
        onPress={() => navigation.navigate('Preview')}
      />
    </View>
  );
}