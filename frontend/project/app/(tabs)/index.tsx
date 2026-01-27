import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowRightLeft, 
  LogOut, 
  Wallet,
  ShieldCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react-native';

export default function Home() {
  const { user, balance, updateBalance, logout } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchBalance = async () => {
    try {
      setError('');
      if (!user?.username) {
        setError('User info missing');
        return;
      }
      const data = await apiService.getBalance(user.username);
      updateBalance(data.balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalance();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) fetchBalance();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Dark Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.usernameText}>{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5856D6" />
        }
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Black Gloss Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.cardTop}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.walletCircle}>
                <Wallet size={16} color="#FFF" />
              </View>
              <Text style={styles.cardTag}>PREMIUM ACCOUNT</Text>
            </View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              ${balance !== null && balance !== undefined ? balance.toFixed(2) : '0.00'}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.accLabel}>ACCOUNT ID</Text>
              <Text style={styles.accNo}>
                {user?.accountNumber ? String(user.accountNumber) : '0000 0000'}
              </Text>
            </View>
            <ShieldCheck size={24} color="#5856D6" />
          </View>
        </View>

        {/* Action Grid */}
        <Text style={styles.sectionLabel}>Operations</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/deposit')}>
            <View style={[styles.iconCircle, { backgroundColor: '#1C1C1E' }]}>
              <ArrowDownToLine size={22} color="#34C759" />
            </View>
            <Text style={styles.iconLabel}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/withdraw')}>
            <View style={[styles.iconCircle, { backgroundColor: '#1C1C1E' }]}>
              <ArrowUpFromLine size={22} color="#FF9500" />
            </View>
            <Text style={styles.iconLabel}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/transfer')}>
            <View style={[styles.iconCircle, { backgroundColor: '#1C1C1E' }]}>
              <ArrowRightLeft size={22} color="#5856D6" />
            </View>
            <Text style={styles.iconLabel}>Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Insights Section */}
        <Text style={styles.sectionLabel}>Insights</Text>
        <TouchableOpacity style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.insightIconWrapper}>
              <TrendingUp size={20} color="#5856D6" />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.infoTitle}>Spending Analysis</Text>
              <Text style={styles.infoSub}>Your savings increased by 12% this week</Text>
            </View>
            <ChevronRight size={18} color="#48484A" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep Black
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greetingText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  usernameText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  balanceCard: {
    backgroundColor: '#1C1C1E', // Onyx Card
    borderRadius: 30,
    padding: 24,
    minHeight: 220,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 30,
  },
  walletCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  cardTag: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 1.5,
  },
  balanceLabel: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '700',
    marginTop: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  accLabel: {
    color: '#48484A',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  accNo: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionItem: {
    width: '30%',
    backgroundColor: '#1C1C1E',
    paddingVertical: 22,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#AEAEB2',
  },
  infoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#5856D615',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoSub: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 3,
  },
  errorBox: {
    backgroundColor: '#FF3B3020',
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF3B3040',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  }
});