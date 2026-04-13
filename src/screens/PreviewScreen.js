import { View, Text } from 'react-native';

export default function PreviewScreen({ route }) {
  const { clientName, services, total } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text>Client: {clientName}</Text>

      {services.map((item) => (
        <Text key={item.id}>
          {item.name} - {item.price}
        </Text>
      ))}

      <Text>Total: {total}</Text>
    </View>
  );
}