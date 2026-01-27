import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { apiService } from '@/services/api';
import { Transaction } from '@/types/api';
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, History as HistoryIcon, Clock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function History() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user?.username]);

  const fetchTransactions = async () => {
    if (!user?.username) return;
    try {
      setError('');
      const data = await apiService.getTransactionHistory(user.username);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    const iconSize = 20;
    const stroke = 2.5;
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownToLine size={iconSize} color="#34C759" strokeWidth={stroke} />;
      case 'WITHDRAW':
        return <ArrowUpFromLine size={iconSize} color="#FF9500" strokeWidth={stroke} />;
      case 'TRANSFER':
        return <ArrowRightLeft size={iconSize} color="#5856D6" strokeWidth={stroke} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={[styles.iconWrapper, 
        { backgroundColor: item.type === 'DEPOSIT' ? '#34C75915' : 
                          item.type === 'WITHDRAW' ? '#FF950015' : '#5856D615' }]}>
        {getTransactionIcon(item.type)}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.typeText}>{item.type}</Text>
        <View style={styles.dateRow}>
          <Clock size={12} color="#48484A" style={{marginRight: 4}} />
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
        {item.recipientAccount && (
          <Text style={styles.recipientText}>ID: {item.recipientAccount}</Text>
        )}
      </View>

      <Text style={[styles.amountText, 
        { color: item.type === 'DEPOSIT' ? '#34C759' : '#FFFFFF' }]}>
        {item.type === 'DEPOSIT' ? '+' : '-'}${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5856D6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <HistoryIcon size={40} color="#2C2C2E" />
          </View>
          <Text style={styles.emptyText}>No Activity Yet</Text>
          <Text style={styles.emptySubtext}>
            Your transactions will appear here as soon as you start moving capital.
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5856D6" />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  transactionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  typeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  recipientText: {
    fontSize: 11,
    color: '#5856D6',
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: 17,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: '#FF3B3015',
    margin: 16,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF3B3030',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});