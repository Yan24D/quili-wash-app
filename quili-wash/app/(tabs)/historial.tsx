import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Chip, Searchbar, IconButton } from 'react-native-paper';
import api from '../../services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFocusEffect } from '@react-navigation/native';

interface Registro {
  id: number;
  fecha: string;
  hora: string;
  vehiculo: string;
  vehiculo_nombre: string;
  placa: string | null;
  servicio_nombre: string;
  costo: number;
  porcentaje: number;
  lavador: string;
  observaciones: string | null;
  pago: string;
}

export default function HistorialScreen() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useFocusEffect(
    useCallback(() => {
      cargarRegistros();
    }, [])
  );

  const cargarRegistros = async (placa: string = '') => {
    setLoading(true);
    try {
      const params = placa ? `?placa=${placa}` : '';
      const response = await api.get(`/registros${params}`);
      setRegistros(response.data.registros);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    cargarRegistros(searchQuery);
  };

  const formatMoney = (amount: number) => {
    return `$${Math.round(amount).toLocaleString('es-CO')}`;
  };

  const formatDate = (date: string) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getVehiculoIcon = (tipo: string) => {
    switch (tipo) {
      case 'motorcycle':
        return 'motorbike';
      case 'car':
        return 'car';
      case 'pickup':
        return 'truck';
      case 'truck':
        return 'truck-delivery';
      default:
        return 'car';
    }
  };

  // Estilos dinámicos
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.surface,
      gap: 8,
    },
    searchbar: {
      flex: 1,
      elevation: 0,
      backgroundColor: colors.background,
    },
    emptyText: {
      color: colors.textSecondary,
    },
    card: {
      margin: 12,
      elevation: 2,
      backgroundColor: colors.surface,
    },
    vehiculoTipo: {
      fontWeight: 'bold',
      color: colors.text,
    },
    placa: {
      color: colors.textSecondary,
      marginTop: 2,
    },
    costo: {
      fontWeight: 'bold',
      color: colors.primary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    chip: {
      backgroundColor: colorScheme === 'dark' ? colors.border : '#f3f4f6',
    },
    chipPagado: {
      backgroundColor: colorScheme === 'dark' ? '#1e4d37' : '#d1fae5',
    },
    chipPendiente: {
      backgroundColor: colorScheme === 'dark' ? '#4d3e1e' : '#fef3c7',
    },
    chipText: {
      fontSize: 12,
      color: colors.text,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.searchContainer}>
        <Searchbar
          placeholder="Buscar por placa..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={dynamicStyles.searchbar}
          iconColor={colors.primary}
          placeholderTextColor={colors.textSecondary}
          inputStyle={{ color: colors.text }}
        />
        <IconButton
          icon="magnify"
          mode="contained"
          iconColor="#fff"
          containerColor={colors.primary}
          size={24}
          onPress={handleSearch}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => cargarRegistros()} />
        }
      >
        {registros.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={dynamicStyles.emptyText}>
              No hay registros para mostrar
            </Text>
          </View>
        ) : (
          registros.map((registro) => (
            <Card key={registro.id} style={dynamicStyles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <IconButton
                      icon={getVehiculoIcon(registro.vehiculo)}
                      size={24}
                      iconColor={colors.primary}
                      style={styles.vehiculoIcon}
                    />
                    <View>
                      <Text variant="titleMedium" style={dynamicStyles.vehiculoTipo}>
                        {registro.vehiculo_nombre}
                      </Text>
                      <Text variant="bodySmall" style={dynamicStyles.placa}>
                        {registro.placa || 'Sin placa'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.headerRight}>
                    <Text variant="headlineSmall" style={dynamicStyles.costo}>
                      {formatMoney(registro.costo)}
                    </Text>
                  </View>
                </View>

                <View style={dynamicStyles.divider} />

                <View style={styles.infoRow}>
                  <IconButton icon="car-wash" size={18} iconColor={colors.textSecondary} />
                  <Text style={dynamicStyles.infoText}>{registro.servicio_nombre}</Text>
                </View>

                <View style={styles.infoRow}>
                  <IconButton icon="account" size={18} iconColor={colors.textSecondary} />
                  <Text style={dynamicStyles.infoText}>{registro.lavador || 'Sin asignar'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <IconButton icon="calendar" size={18} iconColor={colors.textSecondary} />
                  <Text style={dynamicStyles.infoText}>
                    {formatDate(registro.fecha)} - {registro.hora}
                  </Text>
                </View>

                {registro.observaciones && (
                  <View style={styles.infoRow}>
                    <IconButton icon="note-text" size={18} iconColor={colors.textSecondary} />
                    <Text style={dynamicStyles.infoText}>{registro.observaciones}</Text>
                  </View>
                )}

                <View style={styles.footer}>
                  <Chip
                    icon="percent"
                    style={dynamicStyles.chip}
                    textStyle={dynamicStyles.chipText}
                  >
                    Comisión: {registro.porcentaje}%
                  </Chip>
                  <Chip
                    icon={registro.pago === 'Pagado' ? 'check-circle' : 'clock-outline'}
                    style={[
                      dynamicStyles.chip,
                      registro.pago === 'Pagado' ? dynamicStyles.chipPagado : dynamicStyles.chipPendiente,
                    ]}
                    textStyle={dynamicStyles.chipText}
                  >
                    {registro.pago}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehiculoIcon: {
    margin: 0,
    marginRight: 8,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
});