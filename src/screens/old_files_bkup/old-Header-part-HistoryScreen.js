{/* xxxxxxxxxxxxxxxxxx        */}
{/* 🔍 Search Input & Reset Button (সবসময় দেখা যাবে) */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginTop: 10 }}>
        <TextInput 
          placeholder="Search client..." 
          value={search} 
          onChangeText={(t) => { setSearch(t); setCurrentPage(1); }} 
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }} 
        />
        
        {/* 🧹 Reset/Refresh Button */}
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
            marginLeft: 8, 
            padding: 10, 
            backgroundColor: '#f8d7da', // হালকা লাল ব্যাকগ্রাউন্ড
            borderRadius: 8, 
            borderWidth: 1, 
            borderColor: '#f5c6cb',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Ionicons name="refresh" size={20} color="#dc3545" /> 
        </TouchableOpacity>
      </View>
      
      {/* 🔽 Summary & Toggle Button (সবসময় দেখা যাবে) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginVertical: 10 }}>
        <Text style={{ fontWeight: "400", fontSize: 11, color: '#444' }}>
          Total: {list.length} | Showing: {filteredList.length}
        </Text>
        
        <TouchableOpacity 
          onPress={() => setIsFilterVisible(!isFilterVisible)} 
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' }}
        >
          <Text style={{ marginRight: 5, fontSize: 12, color: '#555', fontWeight: 'bold' }}>
            {isFilterVisible ? "Hide Menu" : "Show Menu"}
          </Text>
          <Ionicons name={isFilterVisible ? "chevron-up" : "chevron-down"} size={18} color="#555" />
        </TouchableOpacity>
      </View>
{/* yyyyyyyyyyyyyyyyyyy  */}
{/* 🔴 লাল দাগের অংশ (টোগল হবে) - Super Compact Version */}
      {isFilterVisible && (
        <View style={{ backgroundColor: '#fff', paddingBottom: 5, borderBottomWidth: 1, borderColor: '#eee' }}>
          
          {/* => ১ম এরিয়া: ফিল্টার ও সর্টিং (অল্প জায়গায়) */}
          <View style={{ backgroundColor: '#f8f9fa', margin: 5, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' }}>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <TextInput placeholder="Min" value={minAmount} keyboardType="numeric" onChangeText={(t) => { setMinAmount(t); setCurrentPage(1); }} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 5, marginRight: 5, borderRadius: 5, fontSize: 12, backgroundColor: '#fff' }} />
              <TextInput placeholder="Max" value={maxAmount} keyboardType="numeric" onChangeText={(t) => { setMaxAmount(t); setCurrentPage(1); }} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 5, borderRadius: 5, fontSize: 12, backgroundColor: '#fff' }} />
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <TouchableOpacity onPress={() => setShowFromPicker(true)} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 7, marginRight: 5, borderRadius: 5, backgroundColor: '#fff' }}><Text style={{fontSize: 11}}>{fromDate || 'From'}</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setShowToPicker(true)} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 7, borderRadius: 5, backgroundColor: '#fff' }}><Text style={{fontSize: 11}}>{toDate || 'To'}</Text></TouchableOpacity>
            </View>
            
            {/* সর্টিং বাটনগুলো এখন এক লাইনে বাম-ডানে স্ক্রল হবে */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
              {['latest', 'oldest', 'amount_high', 'amount_low', 'az'].map(type => (
                <TouchableOpacity key={type} onPress={() => { setSortType(type); setCurrentPage(1); }} style={{ padding: 6, backgroundColor: sortType === type ? '#007bff' : '#dee2e6', borderRadius: 5, marginRight: 5 }}>
                  <Text style={{ color: sortType === type ? '#fff' : '#495057', fontSize: 10 }}>{type.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* => ২য় ও ৩য় এরিয়া গ্রুপ: সিলেকশন ও অ্যাকশন (একত্রে ছোট করা হয়েছে) */}
          <View style={{ backgroundColor: '#e7f3ff', margin: 5, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#b1d7ff' }}>
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
              <View style={{ flexDirection: 'row', marginTop: 8, borderTopWidth: 1, borderColor: '#b1d7ff', paddingTop: 8 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity onPress={exportSelectedPDFs} style={{ backgroundColor: '#6f42c1', padding: 6, borderRadius: 5, marginRight: 5 }}><Text style={{ color: '#fff', fontSize: 10 }}>PDFs</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => exportSmartCSV(selectedItems)} style={{ backgroundColor: '#17a2b8', padding: 6, borderRadius: 5, marginRight: 5 }}><Text style={{ color: '#fff', fontSize: 10 }}>CSVs</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleBulkDelete} style={{ backgroundColor: "#dc3545", padding: 6, borderRadius: 5 }}> 
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: 'bold' }}>Delete ({selectedItems.length})</Text>
                    </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>

          {/* => ৪র্থ এরিয়া গ্রুপ: ব্যাকআপ ও ইমপোর্ট (সবচেয়ে নিচে ছোট করে) */}
          <View style={{ flexDirection: 'row', marginHorizontal: 5, marginBottom: 5 }}>
            <TouchableOpacity onPress={exportAllSmartCSV} style={{ flex: 1, backgroundColor: "#343a40", padding: 8, borderRadius: 5, marginRight: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 11 }}>Backup All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImportCSV} style={{ flex: 1, backgroundColor: "#28a745", padding: 8, borderRadius: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 11 }}>Import CSV</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}
{/* zzzzzzzzzzzzzzzzzzzzzz  */}







{/* ২. সিলেকশন কন্টেন্ট */}
{isSelectionSubOpen && (
  <View style={{ backgroundColor: '#e7f3ff', marginHorizontal: 8, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#b1d7ff', marginBottom: 5 }}>
    
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      
      {/* বাম পাশে সিলেকশন টোগল বাটন */}
      <TouchableOpacity 
        onPress={() => setIsSelectionMode(!isSelectionMode)} 
        style={{ backgroundColor: isSelectionMode ? '#28a745' : '#007bff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5 }}
      >
        <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {isSelectionMode ? 'Selection ON' : 'Select Items'}
        </Text>
      </TouchableOpacity>

      {/* --- নতুন অংশ: সিলেকশন কাউন্টার ব্যাজ (শুধুমাত্র ১ বা তার বেশি সিলেক্ট হলে দেখাবে) --- */}
      {isSelectionMode && selectedItems.length > 0 && (
        <View style={{ 
          backgroundColor: '#fff', 
          paddingHorizontal: 8, 
          paddingVertical: 2, 
          borderRadius: 12, 
          borderWidth: 1, 
          borderColor: '#007bff',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Ionicons name="layers-outline" size={12} color="#007bff" style={{ marginRight: 4 }} />
          <Text style={{ color: '#007bff', fontSize: 10, fontWeight: 'bold' }}>
            {selectedItems.length} Selected
          </Text>
        </View>
      )}

      {/* ডান পাশে All, History, Clear বাটনসমূহ */}
      {isSelectionMode && (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={selectAll} style={{ padding: 5 }}><Text style={{ color: '#17a2b8', fontSize: 11, fontWeight: 'bold' }}>All</Text></TouchableOpacity>
          <TouchableOpacity onPress={selectAllHistory} style={{ padding: 5, marginLeft: 5 }}><Text style={{ color: '#6f42c1', fontSize: 11, fontWeight: 'bold' }}>History</Text></TouchableOpacity>
          <TouchableOpacity onPress={clearSelection} style={{ padding: 5, marginLeft: 5 }}><Text style={{ color: '#dc3545', fontSize: 11, fontWeight: 'bold' }}>Clear</Text></TouchableOpacity>
        </View>
      )}
    </View>

    {/* সিলেকশন মোড অন থাকলে এক্সপোর্ট এবং ডিলিট বাটন রো */}
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