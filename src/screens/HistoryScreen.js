// src/screens/HistoryScreen.js


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Services and Templates
import { getQuotations, deleteQuotation } from '../services/storageService';
import { generateQuotationHTML } from '../templates/quotationTemplate';

export default function HistoryScreen({ navigation }) {
  // --------------------------------------------------------
  // 1. STATE MANAGEMENT (অবস্থা ব্যবস্থাপনা)
  // --------------------------------------------------------
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Selection States
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Filter States
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [sortType, setSortType] = useState('latest');
const [importHasConflict, setImportHasConflict] = useState(false);

const [showImportModal, setShowImportModal] = useState(false);
const [pendingFileUri, setPendingFileUri] = useState(null);
const [pendingModeData, setPendingModeData] = useState(null);
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // --------------------------------------------------------
  // 2. DATA LOADING & EFFECTS (ডেটা লোড করা)
  // --------------------------------------------------------
  const loadData = async () => {
    setLoading(true);
    const data = await getQuotations();
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  // --------------------------------------------------------
  // 3. SELECTION LOGIC (আইটেম সিলেক্ট করার লজিক)
  // --------------------------------------------------------
  const toggleSelectItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const selectAll = () => setSelectedItems(paginatedList);
  
  const clearSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  // --------------------------------------------------------
  // 4. EXPORT FUNCTIONS (PDF এবং CSV এক্সপোর্ট)
  // --------------------------------------------------------
  
  // Single PDF Export
  const exportAsPDF = async (item) => {
    try {
      const html = generateQuotationHTML(item);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log('PDF Export Error:', error);
    }
  };

  // Single/Filtered CSV Export
  const exportAsCSV = async () => {
    try {
      const header = "Client Name,Total,Date\n";
      const rows = filteredList.map(item =>
        `${item.clientName || ''},${item.grandTotal || 0},${item.createdAt}`
      ).join("\n");

      const csv = header + rows;
      const fileUri = FileSystem.documentDirectory + `quotations_${Date.now()}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        alert("Sharing not available");
      }
    } catch (error) {
      console.log('CSV Export Error:', error);
    }
  };

  // Bulk Exports
  const exportSelectedPDFs = async () => {
    if (selectedItems.length === 0) return Alert.alert("No Selection", "Please select at least one");
    for (const item of selectedItems) {
      await exportAsPDF(item);
    }
  };


const exportSmartCSV = async () => {
  try {
    if (selectedItems.length === 0) {
      return Alert.alert("No Selection", "Please select at least one item");
    }

    const header = "id,data\n";

    const rows = selectedItems.map(item => {
      const safeData = JSON.stringify(item).replace(/"/g, '""'); 
      return `${item.id},"${safeData}"`;
    }).join("\n");

    const csv = header + rows;

    const fileUri =
      FileSystem.documentDirectory + `backup_quotations_${Date.now()}.csv`;

    await FileSystem.writeAsStringAsync(fileUri, csv);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Error", "Sharing not available");
    }
  } catch (error) {
    console.log("Smart CSV Export Error:", error);
  }
};


const importSmartCSV = async (fileUri, mode = "skip") => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const lines = fileContent.split("\n");

    lines.shift();

    const importedItems = [];

    for (let line of lines) {
      if (!line.trim()) continue;

      const firstCommaIndex = line.indexOf(",");
      if (firstCommaIndex === -1) continue;

      let data = line.substring(firstCommaIndex + 1);

      data = data.replace(/^"|"$/g, "");
      data = data.replace(/""/g, '"');

      try {
        const parsed = JSON.parse(data);
        importedItems.push(parsed);
      } catch (e) {}
    }

    if (importedItems.length === 0) {
      return Alert.alert("Error", "No valid data found");
    }

    // =========================
    // CURRENT LIST COPY
    // =========================
    let updatedList = [...list];

    // =========================
    // 🔥 FIXED LOGIC START
    // =========================

    if (mode === "replace") {

      // ✔ ONLY MATCHING IDS WILL REPLACE
      const newList = [...list];

      importedItems.forEach(newItem => {
        const index = newList.findIndex(
          old => old.id === newItem.id
        );

        if (index !== -1) {
          newList[index] = newItem;
        } else {
          newList.push(newItem);
        }
      });

      updatedList = newList;
    }

    else if (mode === "merge") {

      // ✔ NO FULL OVERWRITE, ONLY ADD UNIQUE
      const merged = [...list];

      importedItems.forEach(item => {
        const exists = merged.find(i => i.id === item.id);
        if (!exists) {
          merged.push(item);
        }
      });

      updatedList = merged;
    }

    else if (mode === "skip") {

      const filtered = importedItems.filter(
        newItem => !list.find(old => old.id === newItem.id)
      );

      updatedList = [...filtered, ...list];
    }

    else if (mode === "keep_both") {

      const processed = importedItems.map(item => {
        const exists = list.find(old => old.id === item.id);

        if (exists) {
          return {
            ...item,
            id: `${item.id}_${Date.now()}`,
            clientName: item.clientName
              ? `${item.clientName} (copy)`
              : "Copy"
          };
        }

        return item;
      });

      updatedList = [...processed, ...list];
    }

    // =========================
    // STORAGE SAVE (FIXED KEY)
    // =========================
    await AsyncStorage.setItem(
      "QUOTATIONS_HISTORY",
      JSON.stringify(updatedList)
    );

    setList(updatedList);

    Alert.alert(
      "Import Successful",
      `Mode: ${mode} | Items: ${importedItems.length}`
    );

  } catch (error) {
    console.log("Import Error:", error);
    Alert.alert("Error", "Failed to import file");
  }
};



const handleImportCSV = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const fileUri = result.assets?.[0]?.uri;
    if (!fileUri) return;

    // 🔥 parse first (to check conflict)
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const lines = fileContent.split("\n");
    lines.shift();

    const importedItems = [];

    for (let line of lines) {
      if (!line.trim()) continue;

      const firstCommaIndex = line.indexOf(",");
      if (firstCommaIndex === -1) continue;

      let data = line.substring(firstCommaIndex + 1);
      data = data.replace(/^"|"$/g, "");
      data = data.replace(/""/g, '"');

      try {
        importedItems.push(JSON.parse(data));
      } catch {}
    }

    // 🔥 check conflict
    const hasConflict = importedItems.some(newItem =>
      list.find(old => old.id === newItem.id)
    );

    setPendingFileUri(fileUri);

    // 👉 modal will decide UI
    setImportHasConflict(hasConflict);
    setShowImportModal(true);

  } catch (error) {
    Alert.alert("Error", "File selection failed");
  }
};




  // --------------------------------------------------------
  // 5. FILTER & SORT LOGIC (ফিল্টারিং এবং সর্টিং)
  // --------------------------------------------------------
  const formatDate = (date) => date.toISOString().split('T')[0];

  const filteredList = list
    .filter(item => {
      const nameMatch = (item.clientName || '').toLowerCase().includes(search.toLowerCase());
      const amount = parseFloat(item.grandTotal) || 0;
      const minMatch = minAmount ? amount >= parseFloat(minAmount) : true;
      const maxMatch = maxAmount ? amount <= parseFloat(maxAmount) : true;

      const itemDate = new Date(item.createdAt);
      const dateMatch =
        (!fromDate || itemDate >= new Date(fromDate)) &&
        (!toDate || itemDate <= new Date(toDate + 'T23:59:59'));

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
        case 'latest': return dateB - dateA;
        case 'oldest': return dateA - dateB;
        case 'amount_high': return amountB - amountA;
        case 'amount_low': return amountA - amountB;
        case 'az': return nameA.localeCompare(nameB);
        default: return dateB - dateA;
      }
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isFiltering = search || minAmount || maxAmount || fromDate || toDate;

  // --------------------------------------------------------
  // 6. ACTION HANDLERS (ডিলিট এবং প্রিভিউ)
  // --------------------------------------------------------
  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => { await deleteQuotation(id); loadData(); }, style: 'destructive' }
    ]);
  };

  const openPreview = (item) => navigation.navigate('Preview', item);

  // --------------------------------------------------------
  // --------------------------------------------------------
  // --------------------------------------------------------
  // 7. RENDER COMPONENTS (ইউজার ইন্টারফেস)
  // --------------------------------------------------------
  // --------------------------------------------------------
  // --------------------------------------------------------  
  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.clientName || 'No Client'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isSelectionMode && (
            <TouchableOpacity onPress={() => toggleSelectItem(item)} style={{marginRight: 15}}>
                <Ionicons name={selectedItems.find(i => i.id === item.id) ? "checkbox" : "square-outline"} size={22} color="black" />
            </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
        </View>
      </View>

      <Text>Total: {item.grandTotal}</Text>
      <Text style={{ fontSize: 12, color: '#666' }}>{new Date(item.createdAt).toLocaleString()}</Text>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' }}>
        <TouchableOpacity onPress={() => openPreview(item)} style={{ backgroundColor: '#007bff', padding: 8, borderRadius: 5, marginRight: 5 }}>
          <Text style={{ color: '#fff' }}>Open</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Create', { editData: item })} style={{ backgroundColor: '#28a745', padding: 8, borderRadius: 5, marginRight: 5 }}>
          <Text style={{ color: '#fff' }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => exportAsPDF(item)} style={{ backgroundColor: '#6f42c1', padding: 8, borderRadius: 5 }}>
          <Text style={{ color: '#fff' }}>PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Search Input */}
      <TextInput
        placeholder="Search by client name..."
        value={search}
        onChangeText={(text) => { setSearch(text); setCurrentPage(1); }}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, margin: 10, borderRadius: 8 }}
      />

      {/* Filter Section */}
      <View style={{ paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TextInput 
            placeholder="Min" value={minAmount} keyboardType="numeric"
            onChangeText={(t) => { setMinAmount(t); setCurrentPage(1); }}
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, marginRight: 5, borderRadius: 6 }}
          />
          <TextInput 
            placeholder="Max" value={maxAmount} keyboardType="numeric"
            onChangeText={(t) => { setMaxAmount(t); setCurrentPage(1); }}
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, marginLeft: 5, borderRadius: 6 }}
          />
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setShowFromPicker(true)} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, marginRight: 5, borderRadius: 6 }}>
            <Text>{fromDate || 'From Date'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowToPicker(true)} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, marginLeft: 5, borderRadius: 6 }}>
            <Text>{toDate || 'To Date'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pickers */}
      {showFromPicker && (
        <DateTimePicker value={fromDate ? new Date(fromDate) : new Date()} mode="date" 
        onChange={(e, d) => { setShowFromPicker(false); if(d){setFromDate(formatDate(d)); setCurrentPage(1);}}} />
      )}
      {showToPicker && (
        <DateTimePicker value={toDate ? new Date(toDate) : new Date()} mode="date" 
        onChange={(e, d) => { setShowToPicker(false); if(d){setToDate(formatDate(d)); setCurrentPage(1);}}} />
      )}

      {/* Sort Options */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 7 }}>
        {['latest', 'oldest', 'amount_high', 'amount_low', 'az'].map(type => (
          <TouchableOpacity key={type} onPress={() => { setSortType(type); setCurrentPage(1); }}
            style={{ padding: 8, backgroundColor: sortType === type ? '#007bff' : '#ccc', borderRadius: 5, margin: 3 }}>
            <Text style={{ color: '#fff', fontSize: 12 }}>
              {type === 'latest' ? 'Latest' : type === 'oldest' ? 'Oldest' : type === 'amount_high' ? 'Amt ↓' : type === 'amount_low' ? 'Amt ↑' : 'A-Z'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selection & Export Controls */}
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <TouchableOpacity onPress={() => setIsSelectionMode(!isSelectionMode)} style={{ backgroundColor: isSelectionMode ? '#28a745' : '#007bff', padding: 8, borderRadius: 6, marginRight: 10 }}>
                <Text style={{ color: '#fff' }}>{isSelectionMode ? 'Selection ON' : 'Select Items'}</Text>
            </TouchableOpacity>
            {isSelectionMode && (
                <>
                <TouchableOpacity onPress={selectAll} style={{ backgroundColor: '#17a2b8', padding: 8, borderRadius: 6, marginRight: 10 }}>
                    <Text style={{ color: '#fff' }}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={clearSelection} style={{ backgroundColor: '#dc3545', padding: 8, borderRadius: 6 }}>
                    <Text style={{ color: '#fff' }}>Clear</Text>
                </TouchableOpacity>
                </>
            )}
        </View>
        
        {isSelectionMode && (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={exportSelectedPDFs} style={{ backgroundColor: '#6f42c1', padding: 8, borderRadius: 6, marginRight: 10 }}>
                    <Text style={{ color: '#fff' }}>Export PDFs</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={exportSmartCSV} style={{ backgroundColor: '#17a2b8', padding: 8, borderRadius: 6 }}>
                    <Text style={{ color: '#fff' }}>Export CSVs</Text>
                </TouchableOpacity>
                <TouchableOpacity
  onPress={handleImportCSV}
  style={{
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 6,
    margin: 10
  }}
>
  <Text style={{ color: "#fff", fontWeight: "bold" }}>
    Import CSV (Backup)
  </Text>
</TouchableOpacity>

{showImportModal && (
  <View style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10
  }}>

    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
      {importHasConflict ? "Conflict Detected" : "Ready to Import"}
    </Text>

    {!importHasConflict ? (
      <>
        {/* NO CONFLICT */}
        <TouchableOpacity onPress={() => {
          setShowImportModal(false);
          importSmartCSV(pendingFileUri, "merge");
        }}>
          <Text style={{ padding: 10 }}>Do Import</Text>
        </TouchableOpacity>
      </>
    ) : (
      <>
        {/* CONFLICT OPTIONS */}
        <TouchableOpacity onPress={() => {
          setShowImportModal(false);
          importSmartCSV(pendingFileUri, "skip");
        }}>
          <Text style={{ padding: 10 }}>Skip Duplicates</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          setShowImportModal(false);
          importSmartCSV(pendingFileUri, "replace");
        }}>
          <Text style={{ padding: 10 }}>Replace Matching</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          setShowImportModal(false);
          importSmartCSV(pendingFileUri, "merge");
        }}>
          <Text style={{ padding: 10 }}>Merge All</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          setShowImportModal(false);
          importSmartCSV(pendingFileUri, "keep_both");
        }}>
          <Text style={{ padding: 10 }}>Keep Both (Versioned)</Text>
        </TouchableOpacity>
      </>
    )}

    <TouchableOpacity onPress={() => setShowImportModal(false)}>
      <Text style={{ padding: 10, color: 'red' }}>Cancel</Text>
    </TouchableOpacity>

  </View>
)}


            </View>
        )}
      </View>

      {/* Main List */}
      <FlatList
        data={paginatedList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            {loading ? "Loading..." : "No data found"}
          </Text>
        )}
      />

      {/* Pagination Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderColor: '#eee' }}>
        <TouchableOpacity disabled={currentPage === 1} onPress={() => setCurrentPage(p => p - 1)}
          style={{ backgroundColor: currentPage === 1 ? '#ccc' : '#007bff', padding: 8, borderRadius: 5 }}>
          <Text style={{ color: '#fff' }}>Prev</Text>
        </TouchableOpacity>
        <Text>Page {currentPage} of {totalPages || 1}</Text>
        <TouchableOpacity disabled={currentPage === totalPages || totalPages === 0} onPress={() => setCurrentPage(p => p + 1)}
          style={{ backgroundColor: (currentPage === totalPages || totalPages === 0) ? '#ccc' : '#007bff', padding: 8, borderRadius: 5 }}>
          <Text style={{ color: '#fff' }}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
