import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  StatusBar 
} from 'react-native';
// এখান থেকে SafeAreaView ইমপোর্ট করবেন
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    // 'edges' প্রপসটি দিলে এটি সুন্দরভাবে স্ক্রিন সেট করে নেয়
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* লোগো সেকশন */}
      <View style={styles.header}>
        {/* লোগো ফাইল না থাকলে এই Image ট্যাগটি কমেন্ট করে রাখুন */}
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        /> 
       
        <Text style={styles.appName}>Quotation Maker</Text>
        <Text style={styles.tagline}>Create professional invoices easily</Text>
      </View>

      {/* মেনু কার্ডস */}
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('Create')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
            <Text style={{ fontSize: 30 }}>➕</Text>
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Create Quotation</Text>
            <Text style={styles.cardSubtitle}>Generate new invoice or quote</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('History')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#f1f8e9' }]}>
            <Text style={{ fontSize: 30 }}>📜</Text>
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>History</Text>
            <Text style={styles.cardSubtitle}>View and manage past records</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginTop: 30, // SafeAreaView ব্যবহারের ফলে মার্জিন একটু কমিয়ে দেওয়া হয়েছে
    marginBottom: 40,
  },
    logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
    borderRadius: 20, // লোগো গোল করতে চাইলে
  },
  // বাকি স্টাইলগুলো আগের মতোই থাকবে...
  appName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  tagline: { fontSize: 14, color: '#777', marginTop: 5 },
  menuContainer: { paddingHorizontal: 20 },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  iconContainer: { width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTextContainer: { marginLeft: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  footer: { position: 'absolute', bottom: 20, alignSelf: 'center' },
  versionText: { color: '#bbb', fontSize: 12 },
});