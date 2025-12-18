import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, IconButton, Text } from 'react-native-paper';
import { AuthContext } from '../../contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PerfilScreen() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/screens/LoginScreen');
          },
        },
      ]
    );
  };

  // Estilos dinámicos
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      margin: 16,
      marginBottom: 8,
      elevation: 2,
      backgroundColor: colors.surface,
    },
    userName: {
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    userEmail: {
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    roleBadge: {
      backgroundColor: colorScheme === 'dark' ? '#1e3a5f' : '#dbeafe',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 16,
      marginTop: 12,
    },
    roleText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    sectionTitle: {
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    divider: {
      marginVertical: 12,
      backgroundColor: colors.border,
    },
    optionButton: {
      marginBottom: 8,
      borderColor: colors.border,
    },
    footerText: {
      color: colors.textSecondary,
      marginVertical: 2,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Información del Usuario */}
      <Card style={dynamicStyles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <IconButton
                icon="account-circle"
                size={80}
                iconColor={colors.primary}
                style={styles.avatar}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text variant="headlineMedium" style={dynamicStyles.userName}>
                {user?.nombre}
              </Text>
              <Text variant="bodyMedium" style={dynamicStyles.userEmail}>
                {user?.email}
              </Text>
              <View style={dynamicStyles.roleBadge}>
                <Text style={dynamicStyles.roleText}>
                  {user?.rol === 'secretario' ? 'Secretario' : 'Administrador'}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Información de la Aplicación */}
      <Card style={dynamicStyles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
            Acerca de la Aplicación
          </Text>
          
          <View style={styles.infoRow}>
            <IconButton icon="cellphone" size={20} iconColor={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={dynamicStyles.infoLabel}>Versión</Text>
              <Text style={dynamicStyles.infoValue}>1.0.0</Text>
            </View>
          </View>

          <Divider style={dynamicStyles.divider} />

          <View style={styles.infoRow}>
            <IconButton icon="office-building" size={20} iconColor={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={dynamicStyles.infoLabel}>Sistema</Text>
              <Text style={dynamicStyles.infoValue}>Quili Wash</Text>
            </View>
          </View>

          <Divider style={dynamicStyles.divider} />

          <View style={styles.infoRow}>
            <IconButton icon="calendar" size={20} iconColor={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={dynamicStyles.infoLabel}>Última actualización</Text>
              <Text style={dynamicStyles.infoValue}>Diciembre 2025</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Opciones */}
      <Card style={dynamicStyles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
            Opciones
          </Text>

          <Button
            mode="outlined"
            icon="help-circle"
            onPress={() => Alert.alert('Ayuda', 'Para soporte contacta al administrador del sistema')}
            style={dynamicStyles.optionButton}
            contentStyle={styles.optionButtonContent}
            textColor={colors.text}
          >
            Ayuda y Soporte
          </Button>

          <Button
            mode="outlined"
            icon="information"
            onPress={() => Alert.alert('Información', 'Quili Wash - Sistema de Gestión de Lavadero\nVersión 1.0.0\n\nDesarrollado para optimizar la gestión diaria del lavadero.')}
            style={dynamicStyles.optionButton}
            contentStyle={styles.optionButtonContent}
            textColor={colors.text}
          >
            Información
          </Button>
        </Card.Content>
      </Card>

      {/* Botón de Cerrar Sesión */}
      <Button
        mode="contained"
        onPress={handleLogout}
        buttonColor={colors.error}
        style={styles.logoutButton}
        icon="logout"
        contentStyle={styles.logoutButtonContent}
      >
        Cerrar Sesión
      </Button>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={dynamicStyles.footerText}>
          Quili Wash © 2025
        </Text>
        <Text variant="bodySmall" style={dynamicStyles.footerText}>
          Todos los derechos reservados
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    margin: 0,
  },
  profileInfo: {
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoContent: {
    flex: 1,
    marginLeft: 8,
  },
  optionButtonContent: {
    justifyContent: 'flex-start',
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
  },
});