import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color= {Colors.light.background} />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/screens/LoginScreen'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
