// src/screens/HistoryScreen.js:


import { View, Text, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getQuotations, deleteQuotation } from '../services/storageService';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
// import * as FileSystem from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateQuotationHTML } from '../templates/quotationTemplate';


export default function HistoryScreen({ navigation }) {

const [selectedItems, setSelectedItems] = useState([]);
const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [sortType, setSortType] = useState('latest');


const toggleSelectItem = (item) => {
  const exists = selectedItems.find(i => i.id === item.id);

  if (exists) {
    setSelectedItems(selectedItems.filter(i => i.id !== item.id));
  } else {
    setSelectedItems([...selectedItems, item]);
  }
};
const selectAll = () => {
  setSelectedItems(paginatedList);
};
const clearSelection = () => {
  setSelectedItems([]);
  setIsSelectionMode(false);
};



const exportAsPDF = async (item) => {
  try {
    const html = generateQuotationHTML(item);

    const { uri } = await Print.printToFileAsync({
      html,
    });

    await Sharing.shareAsync(uri);

  } catch (error) {
    console.log('PDF Export Error:', error);
  }
};


const exportAsCSV = async () => {
  try {

    const header = "Client Name,Total,Date\n";

    const rows = filteredList.map(item =>
      `${item.clientName || ''},${item.grandTotal || 0},${item.createdAt}`
    ).join("\n");

    const csv = header + rows;

    const fileUri = FileSystem.documentDirectory + `quotations_${Date.now()}.csv`;

    await FileSystem.writeAsStringAsync(fileUri, csv);

    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      alert("Sharing not available on this device");
      return;
    }

    await Sharing.shareAsync(fileUri);

  } catch (error) {
    console.log('CSV Export Error:', error);
    alert("CSV export failed");
  }
};
// alert("CSV export failed. Check console.");




const exportSelectedPDFs = async () => {
  try {
    if (selectedItems.length === 0) {
      Alert.alert("No Selection", "Please select at least one invoice");
      return;
    }

    for (const item of selectedItems) {

      const html = generateQuotationHTML(item);

      const { uri } = await Print.printToFileAsync({
        html,
      });

      await Sharing.shareAsync(uri);
    }

  } catch (error) {
    console.log("Bulk PDF Export Error:", error);
  }
};

const exportSelectedCSV = async () => {
  try {
    if (selectedItems.length === 0) {
      Alert.alert("No Selection", "Please select at least one invoice");
      return;
    }

    for (const item of selectedItems) {

      const header = "Client Name,Total,Date\n";

      const row = `${item.clientName || ''},${item.grandTotal || 0},${item.createdAt}`;

      const csv = header + row;

      const fileUri =
        FileSystem.documentDirectory +
        `invoice_${item.id || Date.now()}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri);
    }

  } catch (error) {
    console.log("Bulk CSV Export Error:", error);
  }
};




  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

const loadData = async () => {
  setLoading(true);
  const data = await getQuotations();
  setList(data);
  setLoading(false);
};
const isFiltering = search || minAmount || maxAmount || fromDate || toDate;


  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // ✅ FILTER + SORT
  const filteredList = list
    .filter(item => {

      const nameMatch =
        (item.clientName || '').toLowerCase().includes(search.toLowerCase());

      const amount = parseFloat(item.grandTotal) || 0;

      const minMatch = minAmount ? amount >= parseFloat(minAmount) : true;
      const maxMatch = maxAmount ? amount <= parseFloat(maxAmount) : true;

      const dateMatch =
        (!fromDate || new Date(item.createdAt) >= new Date(fromDate)) &&
        (!toDate || new Date(item.createdAt) <= new Date(toDate + 'T23:59:59'));

      return nameMatch && minMatch && maxMatch && dateMatch;
    })
    .sort((a, b) => {

      const amountA = parseFloat(a.grandTotal) || 0;
      const amountB = parseFloat(b.grandTotal) || 0;

      const nameA = (a.clientName || '').toLowerCase();
      const nameB = (b.clientName || '').toLowerCase();

      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      switch (sortType) {

        case 'latest':
          return dateB - dateA;

        case 'oldest':
          return dateA - dateB;

        case 'amount_high':
          return amountB - amountA;

        case 'amount_low':
          return amountA - amountB;

        case 'az':
          return nameA.localeCompare(nameB);

        default:
          return dateB - dateA;
      }

    });

  // ✅ PAGINATION LOGIC
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {item.clientName || 'No Client'}
        </Text>

{isSelectionMode && (
  <TouchableOpacity onPress={() => toggleSelectItem(item)}>
    <Ionicons
      name={selectedItems.find(i => i.id === item.id) ? "checkbox" : "square-outline"}
      size={22}
      color="black"
    />
  </TouchableOpacity>
)}


        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>

      <Text>Total: {item.grandTotal}</Text>

      <Text style={{ fontSize: 12, color: '#666' }}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

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

        <TouchableOpacity
  onPress={() => exportAsPDF(item)}
  style={{
    backgroundColor: '#6f42c1',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10
  }}
>
  <Text style={{ color: '#fff' }}> Export PDF</Text>
</TouchableOpacity>


<TouchableOpacity
  onPress={exportAsCSV}
  style={{
    backgroundColor: '#17a2b8',
    padding: 10,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center'
  }}
>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
    Export CSV (Excel)
  </Text>
</TouchableOpacity>

      </View>

    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>

      {/* SEARCH */}
      <TextInput
        placeholder="Search by client name..."
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          setCurrentPage(1);
        }}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          margin: 10,
          borderRadius: 8
        }}
      />

      <View style={{ paddingHorizontal: 10 }}>

        {/* AMOUNT */}
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>

          <TextInput
            placeholder="Min Amount"
            value={minAmount}
            onChangeText={(text) => {
              setMinAmount(text);
              setCurrentPage(1);
            }}
            keyboardType="numeric"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              marginRight: 5,
              borderRadius: 6
            }}
          />

          <TextInput
            placeholder="Max Amount"
            value={maxAmount}
            onChangeText={(text) => {
              setMaxAmount(text);
              setCurrentPage(1);
            }}
            keyboardType="numeric"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              marginLeft: 5,
              borderRadius: 6
            }}
          />

        </View>

        {/* DATE */}
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>

          <TouchableOpacity
            onPress={() => setShowFromPicker(true)}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              marginRight: 5,
              borderRadius: 6
            }}
          >
            <Text>{fromDate || 'Select From Date'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowToPicker(true)}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              marginLeft: 5,
              borderRadius: 6
            }}
          >
            <Text>{toDate || 'Select To Date'}</Text>
          </TouchableOpacity>

        </View>

        {showFromPicker && (
          <DateTimePicker
            value={fromDate ? new Date(fromDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFromPicker(false);
              if (selectedDate) {
                setFromDate(formatDate(selectedDate));
                setCurrentPage(1);
              }
            }}
          />
        )}

        {showToPicker && (
          <DateTimePicker
            value={toDate ? new Date(toDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowToPicker(false);
              if (selectedDate) {
                setToDate(formatDate(selectedDate));
                setCurrentPage(1);
              }
            }}
          />
        )}

      </View>

      {/* SORT */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>

        {['latest', 'oldest', 'amount_high', 'amount_low', 'az'].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => {
              setSortType(type);
              setCurrentPage(1);
            }}
            style={{
              padding: 8,
              backgroundColor: sortType === type ? '#007bff' : '#ccc',
              borderRadius: 5,
              margin: 3
            }}
          >
            <Text style={{ color: '#fff' }}>
              {type === 'latest' && 'Latest'}
              {type === 'oldest' && 'Oldest'}
              {type === 'amount_high' && 'Amount ↓'}
              {type === 'amount_low' && 'Amount ↑'}
              {type === 'az' && 'A → Z'}
            </Text>
          </TouchableOpacity>
        ))}

      </View>

      {/* Reset or CLEAR all input field */}
      <TouchableOpacity
        onPress={() => {
          setSearch('');
          setFromDate('');
          setToDate('');
          setMinAmount('');
          setMaxAmount('');
          setSortType('latest');
          setCurrentPage(1);
        }}
        style={{
          backgroundColor: '#dc3545',
          padding: 10,
          borderRadius: 8,
          margin: 10,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Clear All Filters
        </Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={paginatedList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
ListEmptyComponent={() => {

  if (loading) {
    return (
      <Text style={{ textAlign: 'center', marginTop: 30 }}>
        Loading quotations...
      </Text>
    );
  }

  if (list.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          No quotations yet
        </Text>
        <Text style={{ color: '#666', marginTop: 5 }}>
          Create your first quotation
        </Text>
      </View>
    );
  }

  if (isFiltering && filteredList.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          No results found
        </Text>
        <Text style={{ color: '#666', marginTop: 5 }}>
          Try changing filters or search
        </Text>
      </View>
    );
  }

  return null;
}}
      />

<View style={{ flexDirection: 'row', margin: 1 }}>

  <TouchableOpacity
    onPress={() => setIsSelectionMode(!isSelectionMode)}
    style={{
      backgroundColor: isSelectionMode ? '#28a745' : '#007bff',
      padding: 8,
      borderRadius: 6,
      marginRight: 10
    }}
  >
    <Text style={{ color: '#fff' }}>
      {isSelectionMode ? 'Selection ON' : 'Select Items'}
    </Text>
  </TouchableOpacity>

  {isSelectionMode && (
    <>
      <TouchableOpacity
        onPress={selectAll}
        style={{ backgroundColor: '#17a2b8', padding: 8, borderRadius: 6, marginRight: 10 }}
      >
        <Text style={{ color: '#fff' }}>Select All</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={clearSelection}
        style={{ backgroundColor: '#dc3545', padding: 8, borderRadius: 6 }}
      >
        <Text style={{ color: '#fff' }}>Clear</Text>
      </TouchableOpacity>

    </>
  )}

</View>
<View style={{ flexDirection: 'row', margin: 1 }}>
  

<TouchableOpacity
  onPress={exportSelectedPDFs}
  style={{
    backgroundColor: '#6f42c1',
    padding: 8,
    borderRadius: 6,
    marginRight: 10
  }}
>
  <Text style={{ color: '#fff' }}>Export PDFs</Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={exportSelectedCSV}
  style={{
    backgroundColor: '#17a2b8',
    padding: 8,
    borderRadius: 6
  }}
>
  <Text style={{ color: '#fff' }}>Export CSVs</Text>
</TouchableOpacity>

</View>

      {/* PAGINATION */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
      }}>

        <TouchableOpacity
          disabled={loading || currentPage === 1}
          onPress={() => setCurrentPage(prev => prev - 1)}
          style={{
            backgroundColor: (loading || currentPage === 1) ? '#ccc' : '#007bff',
            padding: 8,
            borderRadius: 5
          }}
        >
          <Text style={{ color: '#fff' }}>Previous</Text>
        </TouchableOpacity>

        <Text>
          Page {currentPage} / {totalPages || 1}
        </Text>

        <TouchableOpacity
          disabled={loading || currentPage === totalPages || totalPages === 0}
          onPress={() => setCurrentPage(prev => prev + 1)}
          style={{
            backgroundColor:
              (loading || currentPage === totalPages || totalPages === 0)
                ? '#ccc'
                : '#007bff',
            padding: 8,
            borderRadius: 5
          }}
        >
          <Text style={{ color: '#fff' }}>Next</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

