import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/main/BottomNav';
import UserCard from '../../components/common/UserCard';

interface FilterOptions {
  ageMin: number;
  ageMax: number;
  location: string;
  minTrustScore: number;
  verifiedOnly: boolean;
  vipOnly: boolean;
  pricePlan: 'all' | 'A' | 'B' | 'C';
}

const SearchScreen: React.FC = () => {
  const { user, userType, nearbyUsers, setActiveChat, setActiveTab, startNewChat } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    ageMin: 18,
    ageMax: 60,
    location: '',
    minTrustScore: 0,
    verifiedOnly: false,
    vipOnly: false,
    pricePlan: 'all',
  });

  const locations = ['الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير'];
  const trustScores = [0, 50, 70, 85, 90];
  const pricePlans = [
    { value: 'all', label: 'الكل' },
    { value: 'A', label: 'الخطة أ' },
    { value: 'B', label: 'الخطة ب' },
    { value: 'C', label: 'الخطة ج' },
  ];

  // بيانات تجريبية للبحث
  const [searchResults, setSearchResults] = useState(nearbyUsers);

  const handleSearch = () => {
    let results = [...nearbyUsers];
    
    // بحث بالاسم
    if (searchQuery) {
      results = results.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // فلترة العمر
    results = results.filter(user => 
      user.age >= filters.ageMin && user.age <= filters.ageMax
    );
    
    // فلترة الموقع
    if (filters.location) {
      results = results.filter(user => user.location === filters.location);
    }
    
    // فلترة نسبة الثقة
    results = results.filter(user => 
      (user.trustScore || 0) >= filters.minTrustScore
    );
    
    // فلترة الموثقين فقط
    if (filters.verifiedOnly) {
      results = results.filter(user => user.isVerified);
    }
    
    setSearchResults(results);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      ageMin: 18,
      ageMax: 60,
      location: '',
      minTrustScore: 0,
      verifiedOnly: false,
      vipOnly: false,
      pricePlan: 'all',
    });
    setSearchQuery('');
    setSearchResults(nearbyUsers);
    setShowFilters(false);
  };

  const handleUserPress = (user: any) => {
    startNewChat(user);
    setActiveTab('chat');
  };

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🔍 خيارات البحث</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* العمر */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>العمر</Text>
              <View style={styles.ageRange}>
                <TextInput
                  style={styles.ageInput}
                  value={filters.ageMin.toString()}
                  onChangeText={(text) => setFilters({...filters, ageMin: parseInt(text) || 18})}
                  keyboardType="numeric"
                  placeholder="18"
                  placeholderTextColor="#64748b"
                />
                <Text style={styles.ageSeparator}>-</Text>
                <TextInput
                  style={styles.ageInput}
                  value={filters.ageMax.toString()}
                  onChangeText={(text) => setFilters({...filters, ageMax: parseInt(text) || 60})}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>
            
            {/* الموقع */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>المدينة</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationScroll}>
                <TouchableOpacity
                  style={[styles.locationChip, !filters.location && styles.locationChipActive]}
                  onPress={() => setFilters({...filters, location: ''})}
                >
                  <Text style={[styles.locationChipText, !filters.location && styles.locationChipTextActive]}>
                    الكل
                  </Text>
                </TouchableOpacity>
                {locations.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.locationChip, filters.location === loc && styles.locationChipActive]}
                    onPress={() => setFilters({...filters, location: loc})}
                  >
                    <Text style={[styles.locationChipText, filters.location === loc && styles.locationChipTextActive]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* نسبة الثقة */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>نسبة الثقة (أقل من)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trustScores.map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[styles.trustChip, filters.minTrustScore === score && styles.trustChipActive]}
                    onPress={() => setFilters({...filters, minTrustScore: score})}
                  >
                    <Text style={[styles.trustChipText, filters.minTrustScore === score && styles.trustChipTextActive]}>
                      {score === 0 ? 'الكل' : `+${score}%`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* خطة السعر */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>الخطة السعرية</Text>
              <View style={styles.planRow}>
                {pricePlans.map((plan) => (
                  <TouchableOpacity
                    key={plan.value}
                    style={[styles.planChip, filters.pricePlan === plan.value && styles.planChipActive]}
                    onPress={() => setFilters({...filters, pricePlan: plan.value as any})}
                  >
                    <Text style={[styles.planChipText, filters.pricePlan === plan.value && styles.planChipTextActive]}>
                      {plan.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* خيارات إضافية */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>خيارات إضافية</Text>
              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={[styles.optionChip, filters.verifiedOnly && styles.optionChipActive]}
                  onPress={() => setFilters({...filters, verifiedOnly: !filters.verifiedOnly})}
                >
                  <Text style={[styles.optionChipText, filters.verifiedOnly && styles.optionChipTextActive]}>
                    ✓ موثقون فقط
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>إعادة تعيين</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleSearch}>
              <Text style={styles.applyButtonText}>تطبيق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 البحث</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث بالاسم..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Text style={styles.searchButtonText}>بحث</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Text style={styles.filterIcon}>⚙️</Text>
          <Text style={styles.filterText}>فلترة</Text>
        </TouchableOpacity>
      </View>
      
      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {searchResults.length} نتيجة
        </Text>
        <TouchableOpacity onPress={resetFilters}>
          <Text style={styles.resetFiltersText}>إعادة تعيين الفلاتر</Text>
        </TouchableOpacity>
      </View>
      
      {/* Results List */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => handleUserPress(item)}
            showDistance={true}
          />
        )}
        contentContainerStyle={styles.resultsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>لا توجد نتائج</Text>
            <Text style={styles.emptySubtitle}>
              حاول تغيير خيارات البحث أو إعادة تعيين الفلاتر
            </Text>
          </View>
        }
      />
      
      {/* Filter Modal */}
      <FilterModal />
      
      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 14,
  },
  searchButtonText: {
    color: '#bf953f',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    color: '#f8fafc',
    fontSize: 14,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsCount: {
    color: '#64748b',
    fontSize: 12,
  },
  resetFiltersText: {
    color: '#bf953f',
    fontSize: 12,
  },
  resultsList: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  modalClose: {
    fontSize: 20,
    color: '#94a3b8',
  },
  modalContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f8fafc',
    marginBottom: 8,
  },
  ageRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    color: '#f8fafc',
    textAlign: 'center',
  },
  ageSeparator: {
    color: '#64748b',
  },
  locationScroll: {
    flexDirection: 'row',
  },
  locationChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    marginRight: 8,
  },
  locationChipActive: {
    backgroundColor: '#bf953f',
  },
  locationChipText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  locationChipTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  trustChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    marginRight: 8,
  },
  trustChipActive: {
    backgroundColor: '#bf953f',
  },
  trustChipText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  trustChipTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  planRow: {
    flexDirection: 'row',
    gap: 8,
  },
  planChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    alignItems: 'center',
  },
  planChipActive: {
    backgroundColor: '#bf953f',
  },
  planChipText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  planChipTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0f172a',
  },
  optionChipActive: {
    backgroundColor: '#bf953f',
  },
  optionChipText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  optionChipTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#bf953f',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
