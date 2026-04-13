import { View, Text, Button } from 'react-native';
import { generatePDF } from '../services/pdfService';

export default function PreviewScreen({ route }) {
  const { clientName, services, total } = route.params;

  // 🔥 IMPORTANT: Correct data mapping
  const quotationData = {
    clientName,
    items: services,
    total,
  };

  const handleGeneratePDF = async () => {
    try {
      const uri = await generatePDF(quotationData);
      console.log('PDF saved at:', uri);
      alert('PDF Generated!');
    } catch (error) {
      console.log(error);
      alert('Error generating PDF');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Client: {clientName}</Text>

      {services.map((item) => (
        <Text key={item.id}>
          {item.name} - {item.price}
        </Text>
      ))}

      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
        Total: {total}
      </Text>

      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </View>
  );
}