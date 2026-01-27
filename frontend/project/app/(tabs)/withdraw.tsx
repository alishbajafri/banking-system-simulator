import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { ArrowUpFromLine, CheckCircle2, AlertCircle } from 'lucide-react-native';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, balance, updateBalance } = useAuth();
  const router = useRouter();

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);

    if (!amount || isNaN(withdrawAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawAmount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    if (withdrawAmount > balance) {
      setError('Insufficient funds');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await apiService.withdraw({
        username: user.username,
        amount: withdrawAmount,
      });

      updateBalance(response);

      setSuccess(`Successfully withdrew $${withdrawAmount.toFixed(2)}`);
      setAmount('');

      setTimeout(() => {
        router.push('/(tabs)');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <ArrowUpFromLine size={32} color="#FF9500" strokeWidth={2.5} />
            </View>
            <Text style={styles.title}>Withdraw Funds</Text>
            <Text style={styles.subtitle}>
              Safe and secure withdrawal directly to your linked account
            </Text>
          </View>

          {/* Available Balance Badge */}
          <View style={styles.balanceBadge}>
             <Text style={styles.balanceLabel}>Available: </Text>
             <Text style={styles.balanceValue}>${balance.toFixed(2)}</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={18} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View style={styles.successBox}>
              <CheckCircle2 size={18} color="#34C759" />
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.inputLabel}>Amount to Withdraw</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#48484A"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!loading}
                autoFocus={true}
              />
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.infoNote}>
              Withdrawals are processed instantly.
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleWithdraw}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Confirm Withdrawal</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ghostButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.ghostButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5856D6',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#48484A',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginBottom: 16,
  },
  infoNote: {
    fontSize: 12,
    color: '#48484A',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#5856D6',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ghostButton: {
    padding: 16,
    alignItems: 'center',
  },
  ghostButtonText: {
    color: '#48484A',
    fontSize: 15,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B3015',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF3B3030',
    gap: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C75915',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#34C75930',
    gap: 12,
  },
  successText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});