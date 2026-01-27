import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, History } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        // Active color is your signature Indigo, Inactive is a dark charcoal
        tabBarActiveTintColor: '#5856D6', 
        tabBarInactiveTintColor: '#48484A',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2, 
        },
        tabBarStyle: {
          backgroundColor: '#000000', // Deep Black
          borderTopWidth: 1,
          borderTopColor: '#1C1C1E', // Subtle separator
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          
          // MAINTAINED YOUR CUSTOM HEIGHTS:
          height: Platform.OS === 'ios' ? 95 : 90, 
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 12,
        },
        tabBarItemStyle: {
          height: 55,
        },
        headerStyle: {
          backgroundColor: '#000000', // Matches the Onyx theme
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#1C1C1E',
        },
        headerTintColor: '#FFFFFF', // White text for the dark header
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="deposit"
        options={{
          title: 'Deposit',
          tabBarIcon: ({ color }) => (
            <ArrowDownToLine size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="withdraw"
        options={{
          title: 'Withdraw',
          tabBarIcon: ({ color }) => (
            <ArrowUpFromLine size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: 'Transfer',
          tabBarIcon: ({ color }) => (
            <ArrowRightLeft size={22} color={color} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <History size={22} color={color} strokeWidth={2.2} />,
        }}
      />
    </Tabs>
  );
}