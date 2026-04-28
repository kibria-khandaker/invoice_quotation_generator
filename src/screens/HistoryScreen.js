// src/screens/HistoryScreen.js

import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Alert, 
  TextInput, ScrollView 
} from 'react-native';
import JSZip from 'jszip';
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
  
  // ========================================================
  // 1. STATE MANAGEMENT (অবস্থা ব্যবস্থাপনা)
  // ========================================================
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // --- Selection States ---
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // --- Filter & Sort States ---
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [sortType, setSortType] = useState('latest');

  // --- Sub-Menu Toggles ---
  const [isFilterSubOpen, setIsFilterSubOpen] = useState(false);
  const [isSelectionSubOpen, setIsSelectionSubOpen] = useState(false);
  const [isBackupSubOpen, setIsBackupSubOpen] = useState(false);

  // --- Import/Backup States ---
  const [importHasConflict, setImportHasConflict] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingFileUri, setPendingFileUri] = useState(null);

  // --- Pagination & View States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [isShowMenuOpen, setIsShowMenuOpen] = useState(false);

  // ========================================================
  // 2. DATA LOADING & EFFECTS (ডেটা লোড করা)
  // ========================================================
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

  // ========================================================
  // 3. SELECTION LOGIC (আইটেম সিলেক্ট করার লজিক)
  // ========================================================
  const toggleSelectItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const selectAll = () => setSelectedItems(paginatedList);
  
  const selectAllHistory = () => {
    setSelectedItems(filteredList);
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  // ========================================================
  // 4. EXPORT FUNCTIONS (PDF, CSV এবং ব্যাকআপ এক্সপোর্ট)
  // ========================================================
  
  // --- Single PDF Export ---
  const exportAsPDF = async (item) => {
    try {
      const html = generateQuotationHTML(item);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log('PDF Export Error:', error);
    }
  };

  // --- Selected PDF Bulk Export ---
  // const exportSelectedPDFs = async () => {
  //   if (selectedItems.length === 0) return Alert.alert("No Selection", "Please select at least one");
  //   for (const item of selectedItems) {
  //     await exportAsPDF(item);
  //   }
  // };


// --------------------------------------------------------
  // Selected PDF Bulk Export (Smart: Single = PDF, Multi = ZIP)
  // --------------------------------------------------------
  const exportSelectedPDFs = async () => {
    const selectedCount = selectedItems.length;
    if (selectedCount === 0) return Alert.alert("No Selection", "Please select at least one");

    try {
      setLoading(true);

      // --- কেস ১: যদি মাত্র ১টি ফাইল সিলেক্ট করা হয় (নরমাল PDF শেয়ার) ---
      if (selectedCount === 1) {
        const item = selectedItems[0];
        const html = generateQuotationHTML(item);
        const { uri } = await Print.printToFileAsync({ html });
        
        // সরাসরি সেই PDF ফাইলটি শেয়ার হবে
        await Sharing.shareAsync(uri);
      } 
      
      // --- কেস ২: যদি ১টির বেশি ফাইল সিলেক্ট করা হয় (ZIP বান্ডেল শেয়ার) ---
      else {
        const zip = new JSZip();

        for (const item of selectedItems) {
          const html = generateQuotationHTML(item);
          const { uri } = await Print.printToFileAsync({ html });
          
          const base64Data = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const cleanName = (item.clientName || 'Quotation').replace(/\s+/g, '_');
          const fileName = `${cleanName}_${item.id}.pdf`;
          
          zip.file(fileName, base64Data, { base64: true });
        }

        const zipBase64 = await zip.generateAsync({ type: "base64" });
        const zipUri = FileSystem.cacheDirectory + `Quotations_Bundle_${Date.now()}.zip`;
        await FileSystem.writeAsStringAsync(zipUri, zipBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(zipUri, {
          mimeType: 'application/zip',
          dialogTitle: `Share ${selectedCount} Quotations`,
        });
      }

    } catch (error) {
      console.log('Export Error:', error);
      Alert.alert("Error", "Could not export files. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  // --- Smart CSV Export ---
  const exportSmartCSV = async (itemsToExport) => {
    try {
      if (itemsToExport.length === 0) return Alert.alert("No Data", "Nothing to export");

      const header = "id,data\n";
      const rows = itemsToExport.map(item => {
        const safeData = JSON.stringify(item).replace(/"/g, '""'); 
        return `${item.id},"${safeData}"`;
      }).join("\n");

      const csv = header + rows;
      const fileName = itemsToExport.length === list.length ? `full_backup_${Date.now()}.csv` : `backup_quotations_${Date.now()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csv);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Error", "Sharing not available");
      }
    } catch (error) {
      console.log("Export Error:", error);
    }
  };

  const exportAllSmartCSV = () => exportSmartCSV(list);

  // ========================================================
  // 5. IMPORT & BULK DELETE LOGIC (ইমপোর্ট এবং ডিলিট লজিক)
  // ========================================================
  
  // --- Start Import Process ---
  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
      if (result.canceled) return;

      const fileUri = result.assets?.[0]?.uri;
      if (!fileUri) return;

      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const lines = fileContent.split("\n");
      lines.shift(); 

      const importedItems = [];
      for (let line of lines) {
        if (!line.trim()) continue;
        const firstCommaIndex = line.indexOf(",");
        let data = line.substring(firstCommaIndex + 1).replace(/^"|"$/g, "").replace(/""/g, '"');
        try { importedItems.push(JSON.parse(data)); } catch {}
      }

      const hasConflict = importedItems.some(newItem => list.find(old => old.id === newItem.id));
      setPendingFileUri(fileUri);
      setImportHasConflict(hasConflict);
      setShowImportModal(true);
    } catch (error) {
      Alert.alert("Error", "File selection failed");
    }
  };

  // --- Finalize Import ---
  const importSmartCSV = async (fileUri, mode = "skip") => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const lines = fileContent.split("\n");
      lines.shift();

      const importedItems = [];
      for (let line of lines) {
        if (!line.trim()) continue;
        const firstCommaIndex = line.indexOf(",");
        let data = line.substring(firstCommaIndex + 1).replace(/^"|"$/g, "").replace(/""/g, '"');
        try { importedItems.push(JSON.parse(data)); } catch {}
      }

      let updatedList = [...list];

      if (mode === "replace") {
        const newList = [...list];
        importedItems.forEach(newItem => {
          const index = newList.findIndex(old => old.id === newItem.id);
          index !== -1 ? (newList[index] = newItem) : newList.push(newItem);
        });
        updatedList = newList;
      } else if (mode === "merge") {
        const merged = [...list];
        importedItems.forEach(item => {
          if (!merged.find(i => i.id === item.id)) merged.push(item);
        });
        updatedList = merged;
      } else if (mode === "skip") {
        const filtered = importedItems.filter(newItem => !list.find(old => old.id === newItem.id));
        updatedList = [...filtered, ...list];
      } else if (mode === "keep_both") {
        const processed = importedItems.map(item => {
          const exists = list.find(old => old.id === item.id);
          return exists ? { ...item, id: `${item.id}_${Date.now()}`, clientName: `${item.clientName} (copy)` } : item;
        });
        updatedList = [...processed, ...list];
      }

      await AsyncStorage.setItem("QUOTATIONS_HISTORY", JSON.stringify(updatedList));
      setList(updatedList);
      Alert.alert("Success", `Imported successfully using ${mode} mode.`);
    } catch (error) {
      Alert.alert("Error", "Import failed");
    }
  };

  // --- Bulk Delete Action ---
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      return Alert.alert("No Selection", "Please select items first");
    }
    const count = selectedItems.length;
    Alert.alert(
      "Delete Selected Items",
      `${count} items will be permanently deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const itemsToDelete = [...selectedItems];
              for (let i = 0; i < itemsToDelete.length; i++) {
                await deleteQuotation(itemsToDelete[i].id);
              }
              const data = await getQuotations();
              setList(data || []);
              setSelectedItems([]);
              setIsSelectionMode(false);
              setCurrentPage(1);
            } catch (error) {
              Alert.alert("Error", "Bulk delete failed");
            }
          }
        }
      ]
    );
  };

  // ========================================================
  // 6. FILTER & SORT LOGIC (ফিল্টারিং এবং সর্টিং)
  // ========================================================
  const formatDate = (date) => date.toISOString().split('T')[0];

  const filteredList = list
    .filter(item => {
      const nameMatch = (item.clientName || '').toLowerCase().includes(search.toLowerCase());
      const amount = parseFloat(item.grandTotal) || 0;
      const minMatch = minAmount ? amount >= parseFloat(minAmount) : true;
      const maxMatch = maxAmount ? amount <= parseFloat(maxAmount) : true;
      const itemDate = new Date(item.createdAt);
      const dateMatch = (!fromDate || itemDate >= new Date(fromDate)) && 
                        (!toDate || itemDate <= new Date(toDate + 'T23:59:59'));
      return nameMatch && minMatch && maxMatch && dateMatch;
    })
    .sort((a, b) => {
      const amountA = parseFloat(a.grandTotal) || 0, amountB = parseFloat(b.grandTotal) || 0;
      const nameA = (a.clientName || '').toLowerCase(), nameB = (b.clientName || '').toLowerCase();
      const dateA = new Date(a.createdAt), dateB = new Date(b.createdAt);
      switch (sortType) {
        case 'latest': return dateB - dateA;
        case 'oldest': return dateA - dateB;
        case 'amount_high': return amountB - amountA;
        case 'amount_low': return amountA - amountB;
        case 'az': return nameA.localeCompare(nameB);
        default: return dateB - dateA;
      }
    });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ========================================================
  // 7. RENDER HELPERS (UI এলিমেন্টসমূহ)
  // ========================================================
  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => { await deleteQuotation(id); loadData(); }, style: 'destructive' }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.clientName || 'No Client'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isSelectionMode && (
            <TouchableOpacity onPress={() => toggleSelectItem(item)} style={{ marginRight: 15 }}>
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
      <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Preview', item)} style={{ backgroundColor: '#007bff', padding: 8, borderRadius: 5, marginRight: 5 }}><Text style={{ color: '#fff' }}>Open</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Create', { editData: item })} style={{ backgroundColor: '#28a745', padding: 8, borderRadius: 5, marginRight: 5 }}><Text style={{ color: '#fff' }}>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => exportAsPDF(item)} style={{ backgroundColor: '#6f42c1', padding: 8, borderRadius: 5 }}><Text style={{ color: '#fff' }}>PDF</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* ----------------------------------------------------
          A. SEARCH & RESET (সার্চ এবং রিসেট বাটন)
      ------------------------------------------------------ */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginTop: 10 }}>
        <TextInput 
          placeholder="Search client..." 
          value={search} 
          onChangeText={(t) => { setSearch(t); setCurrentPage(1); }} 
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, backgroundColor: '#fff' }} 
        />
        <TouchableOpacity 
          onPress={() => {
            setSearch(''); setFromDate(''); setToDate(''); setMinAmount(''); 
            setMaxAmount(''); setSortType('latest'); setCurrentPage(1);
          }}
          style={{ marginLeft: 8, padding: 10, backgroundColor: '#f8d7da', borderRadius: 8, borderWidth: 1, borderColor: '#f5c6cb', justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="refresh" size={20} color="#dc3545" /> 
        </TouchableOpacity>
      </View>
      
      {/* ----------------------------------------------------
          B. SUMMARY, LIMIT & TOGGLE (সামারি ও মেনু কন্ট্রোল)
      ------------------------------------------------------ */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginVertical: 10 }}>
        <Text style={{ fontWeight: "400", fontSize: 10, color: '#444' }}>
          Showing: {filteredList.length} | Total: {list.length}
        </Text>

        <View style={{ position: 'relative' }}>
          <TouchableOpacity 
            onPress={() => setIsShowMenuOpen(!isShowMenuOpen)} 
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, borderWidth: 1, borderColor: '#ddd' }}
          >
            <Text style={{ fontSize: 10, color: '#555', fontWeight: 'bold' }}>Show: {itemsPerPage}</Text>
            <Ionicons name="chevron-down" size={14} color="#555" style={{ marginLeft: 3 }} />
          </TouchableOpacity>

          {isShowMenuOpen && (
            <View style={{ position: 'absolute', top: 30, left: 0, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ccc', zIndex: 1000, elevation: 5, width: 60 }}>
              {[10, 20, 50, 100].map((num) => (
                <TouchableOpacity 
                  key={num} 
                  onPress={() => { setItemsPerPage(num); setIsShowMenuOpen(false); setCurrentPage(1); }}
                  style={{ paddingVertical: 8, alignItems: 'center', borderBottomWidth: num === 100 ? 0 : 1, borderBottomColor: '#eee' }}
                >
                  <Text style={{ fontSize: 11, color: itemsPerPage === num ? '#007bff' : '#333', fontWeight: itemsPerPage === num ? 'bold' : 'normal' }}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          onPress={() => setIsFilterVisible(!isFilterVisible)} 
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' }}
        >
          <Text style={{ marginRight: 4, fontSize: 10, color: '#555', fontWeight: 'bold' }}>{isFilterVisible ? "Hide Menu" : "Show Menu"}</Text>
          <Ionicons name={isFilterVisible ? "chevron-up" : "chevron-down"} size={14} color="#555" />
        </TouchableOpacity>
      </View>

      {/* ----------------------------------------------------
          C. EXPANDABLE MENUS (সাব-মেনু সেকশন)
      ------------------------------------------------------ */}
      {isFilterVisible && (
        <View style={{ backgroundColor: '#fff', paddingBottom: 5, borderBottomWidth: 1, borderColor: '#eee' }}>
          
          {/* Sub-Menu Icon Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 8, backgroundColor: '#f1f3f5', margin: 5, borderRadius: 10 }}>
            <TouchableOpacity onPress={() => setIsFilterSubOpen(!isFilterSubOpen)} style={{ alignItems: 'center', flex: 1 }}>
              <Ionicons name="funnel-outline" size={18} color={isFilterSubOpen ? "#007bff" : "#495057"} />
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: isFilterSubOpen ? "#007bff" : "#495057", marginTop: 2 }}>FILTERS</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSelectionSubOpen(!isSelectionSubOpen)} style={{ alignItems: 'center', flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#dee2e6' }}>
              <Ionicons name="checkmark-circle-outline" size={18} color={isSelectionSubOpen ? "#007bff" : "#495057"} />
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: isSelectionSubOpen ? "#007bff" : "#495057", marginTop: 2 }}>SELECT</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsBackupSubOpen(!isBackupSubOpen)} style={{ alignItems: 'center', flex: 1 }}>
              <Ionicons name="cloud-download-outline" size={18} color={isBackupSubOpen ? "#007bff" : "#495057"} />
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: isBackupSubOpen ? "#007bff" : "#495057", marginTop: 2 }}>BACKUP</Text>
            </TouchableOpacity>
          </View>

          {/* 1. Filter Sub-Menu Content */}
          {isFilterSubOpen && (
            <View style={{ backgroundColor: '#f8f9fa', marginHorizontal: 8, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 5 }}>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <TextInput placeholder="Min" value={minAmount} keyboardType="numeric" onChangeText={(t) => { setMinAmount(t); setCurrentPage(1); }} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 5, marginRight: 5, borderRadius: 5, fontSize: 12, backgroundColor: '#fff' }} />
                <TextInput placeholder="Max" value={maxAmount} keyboardType="numeric" onChangeText={(t) => { setMaxAmount(t); setCurrentPage(1); }} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 5, borderRadius: 5, fontSize: 12, backgroundColor: '#fff' }} />
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <TouchableOpacity onPress={() => setShowFromPicker(true)} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 7, marginRight: 5, borderRadius: 5, backgroundColor: '#fff' }}><Text style={{fontSize: 11}}>{fromDate || 'From'}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setShowToPicker(true)} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 7, borderRadius: 5, backgroundColor: '#fff' }}><Text style={{fontSize: 11}}>{toDate || 'To'}</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['latest', 'oldest', 'amount_high', 'amount_low', 'az'].map(type => (
                  <TouchableOpacity key={type} onPress={() => { setSortType(type); setCurrentPage(1); }} style={{ padding: 6, backgroundColor: sortType === type ? '#007bff' : '#dee2e6', borderRadius: 5, marginRight: 5 }}>
                    <Text style={{ color: sortType === type ? '#fff' : '#495057', fontSize: 10 }}>{type.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 2. Selection Sub-Menu Content */}
          {isSelectionSubOpen && (
            <View style={{ backgroundColor: '#e7f3ff', marginHorizontal: 8, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#b1d7ff', marginBottom: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => setIsSelectionMode(!isSelectionMode)} style={{ backgroundColor: isSelectionMode ? '#28a745' : '#007bff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{isSelectionMode ? 'Selection ON' : 'Select Items'}</Text>
                </TouchableOpacity>
                {isSelectionMode && (
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={selectAll} style={{ padding: 5 }}><Text style={{ color: '#17a2b8', fontSize: 11, fontWeight: 'bold' }}>All</Text></TouchableOpacity>
                    <TouchableOpacity onPress={selectAllHistory} style={{ padding: 5, marginLeft: 5 }}><Text style={{ color: '#6f42c1', fontSize: 11, fontWeight: 'bold' }}>History</Text></TouchableOpacity>
                    <TouchableOpacity onPress={clearSelection} style={{ padding: 5, marginLeft: 5 }}><Text style={{ color: '#dc3545', fontSize: 11, fontWeight: 'bold' }}>Clear</Text></TouchableOpacity>
                  </View>
                )}
              </View>
              {isSelectionMode && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, borderTopWidth: 1, borderColor: '#b1d7ff', paddingTop: 8 }}>
                  <TouchableOpacity onPress={exportSelectedPDFs} style={{ backgroundColor: '#6f42c1', padding: 6, borderRadius: 5, marginRight: 5 }}><Text style={{ color: '#fff', fontSize: 10 }}>PDFs</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => exportSmartCSV(selectedItems)} style={{ backgroundColor: '#17a2b8', padding: 6, borderRadius: 5, marginRight: 5 }}><Text style={{ color: '#fff', fontSize: 10 }}>CSVs</Text></TouchableOpacity>
                  <TouchableOpacity onPress={handleBulkDelete} style={{ backgroundColor: "#dc3545", padding: 6, borderRadius: 5 }}> 
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: 'bold' }}>Delete ({selectedItems.length})</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          )}

          {/* 3. Backup Sub-Menu Content */}
          {isBackupSubOpen && (
            <View style={{ flexDirection: 'row', marginHorizontal: 8, padding: 8, backgroundColor: '#f1f3f5', borderRadius: 8, borderWidth: 1, borderColor: '#ced4da', marginBottom: 5 }}>
              <TouchableOpacity onPress={exportAllSmartCSV} style={{ flex: 1, backgroundColor: "#343a40", padding: 8, borderRadius: 5, marginRight: 5 }}>
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 11 }}>Full Backup</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleImportCSV} style={{ flex: 1, backgroundColor: "#28a745", padding: 8, borderRadius: 5 }}>
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 11 }}>Import CSV</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ----------------------------------------------------
          D. LIST AREA (ডেটা লিস্ট)
      ------------------------------------------------------ */}
      <FlatList 
        data={paginatedList} 
        keyExtractor={(item) => item.id.toString()} 
        renderItem={renderItem} 
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
              <Text>{loading ? "Loading..." : "No data found"}</Text>
          </View>
        )} 
      />

      {/* ----------------------------------------------------
          E. PAGINATION FOOTER (পেজিনেশন কন্ট্রোল)
      ------------------------------------------------------ */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderColor: '#eee' }}>
        <TouchableOpacity 
          disabled={currentPage === 1} 
          onPress={() => setCurrentPage(p => p - 1)} 
          style={{ backgroundColor: currentPage === 1 ? '#ccc' : '#007bff', padding: 8, borderRadius: 5 }}
        >
          <Text style={{ color: '#fff' }}>Prev</Text>
        </TouchableOpacity>
        
        <Text>Page {currentPage} of {totalPages || 1}</Text>
        
        <TouchableOpacity 
          disabled={currentPage === totalPages || totalPages === 0} 
          onPress={() => setCurrentPage(p => p + 1)} 
          style={{ backgroundColor: (currentPage === totalPages || totalPages === 0) ? '#ccc' : '#007bff', padding: 8, borderRadius: 5 }}
        >
          <Text style={{ color: '#fff' }}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* ----------------------------------------------------
          F. MODALS & PICKERS (ডেট পিকার এবং ইমপোর্ট মডাল)
      ------------------------------------------------------ */}
      {showFromPicker && (
        <DateTimePicker value={new Date()} mode="date" display="default" onChange={(e, d) => { setShowFromPicker(false); if(d) setFromDate(formatDate(d)); }} />
      )}
      {showToPicker && (
        <DateTimePicker value={new Date()} mode="date" display="default" onChange={(e, d) => { setShowToPicker(false); if(d) setToDate(formatDate(d)); }} />
      )}

      {/* Import Conflict Modal */}
      {showImportModal && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15, elevation: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{importHasConflict ? "Conflict Detected" : "Ready to Import"}</Text>
          {importHasConflict ? (
            <View>
              <TouchableOpacity onPress={() => { setShowImportModal(false); importSmartCSV(pendingFileUri, "skip"); }}><Text style={{ padding: 10, color: '#007bff' }}>Skip Duplicates</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowImportModal(false); importSmartCSV(pendingFileUri, "replace"); }}><Text style={{ padding: 10, color: '#007bff' }}>Replace Matching</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowImportModal(false); importSmartCSV(pendingFileUri, "merge"); }}><Text style={{ padding: 10, color: '#007bff' }}>Merge All</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowImportModal(false); importSmartCSV(pendingFileUri, "keep_both"); }}><Text style={{ padding: 10, color: '#007bff' }}>Keep Both (Create Copy)</Text></TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { setShowImportModal(false); importSmartCSV(pendingFileUri, "merge"); }}><Text style={{ padding: 10, color: '#28a745' }}>Proceed with Import</Text></TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowImportModal(false)}><Text style={{ padding: 10, color: 'red', textAlign: 'center' }}>Cancel</Text></TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}