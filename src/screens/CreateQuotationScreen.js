import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useState } from 'react';

export default function CreateQuotationScreen({ navigation }) {
  const [clientName, setClientName] = useState('');
  const [services, setServices] = useState([
    { id: '1', name: '', price: '' }
  ]);

  // Add new service
  const addService = () => {
    setServices([
      ...services,
      { id: Date.now().toString(), name: '', price: '' }
    ]);
  };

  // Update service
  const updateService = (id, field, value) => {
    const updated = services.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setServices(updated);
  };

  // Remove service
  const removeService = (id) => {
    const filtered = services.filter((item) => item.id !== id);
    setServices(filtered);
  };

  // Calculate total
  const total = services.reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0);
  }, 0);

  return (
    <View style={{ padding: 20 }}>
      <Text>Client Name</Text>
      <TextInput
        placeholder="Enter client name"
        value={clientName}
        onChangeText={setClientName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Services</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Service Name"
              value={item.name}
              onChangeText={(text) =>
                updateService(item.id, 'name', text)
              }
              style={{ borderWidth: 1, marginBottom: 5, padding: 8 }}
            />

            <TextInput
              placeholder="Price"
              keyboardType="numeric"
              value={item.price}
              onChangeText={(text) =>
                updateService(item.id, 'price', text)
              }
              style={{ borderWidth: 1, marginBottom: 5, padding: 8 }}
            />

            <Button title="Remove" onPress={() => removeService(item.id)} />
          </View>
        )}
      />

      <Button title="Add Service" onPress={addService} />

      <Text style={{ marginTop: 20 }}>Total: {total}</Text>

      <Button
        title="Go to Preview"
        onPress={() =>
          navigation.navigate('Preview', {
            clientName,
            services,
            total
          })
        }
      />
    </View>
  );
}