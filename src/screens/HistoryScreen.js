import { View, Text, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getQuotations, deleteQuotation } from '../services/storageService';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen({ navigation }) {

  const [list, setList] = useState([]);

  const loadData = async () => {
    const data = await getQuotations();
    setList(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this quotation?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteQuotation(id);
            loadData();
          },
          style: 'destructive'
        }
      ]
    );
  };

  const openPreview = (item) => {
    navigation.navigate('Preview', item);
  };

const renderItem = ({ item }) => (
  <View
    style={{
      padding: 12,
      borderBottomWidth: 1,
      borderColor: '#ccc'
    }}
  >

    {/* TOP ROW */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        {item.clientName || 'No Client'}
      </Text>

      {/* DELETE ICON */}
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash-outline" size={20} color="red" />
      </TouchableOpacity>

    </View>

    {/* INFO */}
    <Text>Total: {item.grandTotal}</Text>

    <Text style={{ fontSize: 12, color: '#666' }}>
      {new Date(item.createdAt).toLocaleString()}
    </Text>

    {/* ACTION BUTTONS */}
    <View style={{ flexDirection: 'row', marginTop: 8 }}>

      <TouchableOpacity
        onPress={() => openPreview(item)}
        style={{
          backgroundColor: '#007bff',
          padding: 8,
          borderRadius: 5,
          marginRight: 10
        }}
      >
        <Text style={{ color: '#fff' }}>Open</Text>
      </TouchableOpacity>

      {/* FUTURE EDIT BUTTON PLACEHOLDER */}
<TouchableOpacity
  onPress={() => navigation.navigate('Create', { editData: item })}
  style={{
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5
  }}
>
  <Text style={{ color: '#fff' }}>Edit</Text>
</TouchableOpacity>




    </View>

  </View>
);


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No quotations saved
          </Text>
        }
      />

    </SafeAreaView>
  );
}