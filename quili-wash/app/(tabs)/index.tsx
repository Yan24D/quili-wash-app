import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, IconButton, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Stats {
  ingresos_totales: number;
  comisiones_pagadas: number;
  ganancia_neta: number;
  cantidad_servicios: number;
  servicios_pendientes?: number;
  monto_pendiente?: number;
}

interface ComisionLavador {
  id_lavador: number;
  nombre: string;
  cantidad_servicios: number;
  total_servicios: number;
  total_comision: number;
  porcentaje_promedio: number;
}

interface ComisionesData {
  fecha: string;
  lavadores: ComisionLavador[];
  totales: {
    servicios: number;
    comisiones: number;
  };
}

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    ingresos_totales: 0,
    comisiones_pagadas: 0,
    ganancia_neta: 0,
    cantidad_servicios: 0,
    servicios_pendientes: 0,
    monto_pendiente: 0,
  });
  const [comisiones, setComisiones] = useState<ComisionesData>({
    fecha: '',
    lavadores: [],
    totales: { servicios: 0, comisiones: 0 }
  });

  // Obtener fecha local del dispositivo (no UTC)
  const obtenerFechaLocal = () => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  const fechaHoy = obtenerFechaLocal();

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar estadísticas generales
      const statsResponse = await api.get(`/registros/cierre-caja?fecha=${fechaHoy}`);
      setStats(statsResponse.data);

      // ✅ Cargar comisiones por lavador
      const comisionesResponse = await api.get(`/lavadores/comisiones?fecha=${fechaHoy}`);
      setComisiones(comisionesResponse.data);

      console.log('✅ Datos cargados correctamente');
    } catch (error: any) {
      console.error('❌ Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount: number) => {
    return `$ ${Math.round(amount).toLocaleString('es-CO')}`;
  };

  // Estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.surface,
      marginBottom: 10,
    },
    greeting: {
      fontWeight: 'bold',
      color: colors.text,
    },
    date: {
      color: colors.textSecondary,
      marginTop: 4,
      textTransform: 'capitalize',
    },
    sectionTitle: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      fontWeight: 'bold',
      color: colors.text,
      backgroundColor: colors.background,
    },
    pendientesCard: {
      margin: 12,
      marginTop: 0,
      padding: 16,
      backgroundColor: colors.surface,
      elevation: 2,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    pendientesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    pendientesTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 8,
    },
    pendientesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    pendientesLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    pendientesValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.warning,
    },
    // Estilos para widget de comisiones
    comisionesCard: {
      margin: 12,
      marginTop: 0,
      backgroundColor: colors.surface,
      elevation: 2,
      borderRadius: 12,
    },
    comisionesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingBottom: 8,
    },
    comisionesHeaderTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    comisionesTotal: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
    },
    lavadorItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lavadorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    lavadorNombre: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    lavadorComision: {
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.success,
    },
    lavadorStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    lavadorStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    lavadorStatText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    emptyComisionesText: {
      padding: 32,
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 14,
    },
  });

  return (
    <ScrollView
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={cargarDatos} />
      }
    >
      <View style={dynamicStyles.header}>
        <Text variant="headlineSmall" style={dynamicStyles.greeting}>
          ¡Hola, {user?.nombre}! 👋
        </Text>
        <Text variant="bodyMedium" style={dynamicStyles.date}>
          {new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
        💰 Caja del Día 
      </Text>

      <View style={styles.cardsContainer}>
        {/* Ingresos Totales - SOLO PAGADOS */}
        <Card style={[styles.card, { backgroundColor: colors.cardGreen }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <IconButton
                icon="currency-usd"
                iconColor="#fff"
                size={32}
                style={styles.icon}
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>INGRESOS EN CAJA</Text>
              <Text style={styles.cardValue}>
                {formatMoney(stats.ingresos_totales)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Servicios Realizados - SOLO PAGADOS */}
        <Card style={[styles.card, { backgroundColor: colors.cardBlue }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <IconButton
                icon="car-wash"
                iconColor="#fff"
                size={32}
                style={styles.icon}
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>SERVICIOS PAGADOS</Text>
              <Text style={styles.cardValue}>{stats.cantidad_servicios}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Comisiones Pagadas */}
        <Card style={[styles.card, { backgroundColor: colors.cardRed }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <IconButton
                icon="hand-coin"
                iconColor="#fff"
                size={32}
                style={styles.icon}
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>COMISIONES PAGADAS</Text>
              <Text style={styles.cardValue}>
                {formatMoney(stats.comisiones_pagadas)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Ganancia Neta */}
        <Card style={[styles.card, { backgroundColor: colors.cardTeal }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <IconButton
                icon="diamond-stone"
                iconColor="#fff"
                size={32}
                style={styles.icon}
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>GANANCIA NETA</Text>
              <Text style={styles.cardValue}>
                {formatMoney(stats.ganancia_neta)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* ✅ NUEVA SECCIÓN: Comisiones por Lavador */}
      <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
        👨‍🔧 Comisiones por Lavador
      </Text>

      <Card style={dynamicStyles.comisionesCard}>
        <View style={dynamicStyles.comisionesHeader}>
          <Text style={dynamicStyles.comisionesHeaderTitle}>
            Total del día
          </Text>
          <Text style={dynamicStyles.comisionesTotal}>
            {formatMoney(comisiones.totales.comisiones)}
          </Text>
        </View>

        <Divider style={{ backgroundColor: colors.border }} />

        {comisiones.lavadores.length === 0 ? (
          <Text style={dynamicStyles.emptyComisionesText}>
            No hay servicios pagados para hoy
          </Text>
        ) : (
          comisiones.lavadores.map((lavador, index) => (
            <View key={lavador.id_lavador}>
              <View style={dynamicStyles.lavadorItem}>
                <View style={dynamicStyles.lavadorHeader}>
                  <Text style={dynamicStyles.lavadorNombre}>
                    {lavador.nombre}
                  </Text>
                  <Text style={dynamicStyles.lavadorComision}>
                    {formatMoney(lavador.total_comision)}
                  </Text>
                </View>

                <View style={dynamicStyles.lavadorStats}>
                  <View style={dynamicStyles.lavadorStatItem}>
                    <IconButton
                      icon="car-wash"
                      size={16}
                      iconColor={colors.textSecondary}
                      style={{ margin: 0 }}
                    />
                    <Text style={dynamicStyles.lavadorStatText}>
                      {lavador.cantidad_servicios} servicio{lavador.cantidad_servicios !== 1 ? 's' : ''}
                    </Text>
                  </View>

                  <View style={dynamicStyles.lavadorStatItem}>
                    <IconButton
                      icon="percent"
                      size={16}
                      iconColor={colors.textSecondary}
                      style={{ margin: 0 }}
                    />
                    <Text style={dynamicStyles.lavadorStatText}>
                      {lavador.porcentaje_promedio.toFixed(0)}% promedio
                    </Text>
                  </View>
                </View>
              </View>

              {index < comisiones.lavadores.length - 1 && (
                <Divider style={{ backgroundColor: colors.border }} />
              )}
            </View>
          ))
        )}
      </Card>

      {/* Servicios Pendientes */}
      {(stats.servicios_pendientes ?? 0) > 0 && (
        <>
          <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
            ⏳ Servicios Pendientes de Pago
          </Text>

          <Card style={dynamicStyles.pendientesCard}>
            <Card.Content>
              <View style={dynamicStyles.pendientesHeader}>
                <IconButton
                  icon="clock-alert"
                  iconColor={colors.warning}
                  size={24}
                  style={{ margin: 0 }}
                />
                <Text style={dynamicStyles.pendientesTitle}>
                  Pendientes por Cobrar
                </Text>
              </View>

              <View style={dynamicStyles.pendientesRow}>
                <Text style={dynamicStyles.pendientesLabel}>
                  Cantidad de servicios:
                </Text>
                <Text style={dynamicStyles.pendientesValue}>
                  {stats.servicios_pendientes}
                </Text>
              </View>

              <View style={dynamicStyles.pendientesRow}>
                <Text style={dynamicStyles.pendientesLabel}>
                  Monto pendiente:
                </Text>
                <Text style={dynamicStyles.pendientesValue}>
                  {formatMoney(stats.monto_pendiente ?? 0)}
                </Text>
              </View>

              <View style={styles.warningNote}>
                <IconButton
                  icon="information"
                  iconColor={colors.warning}
                  size={16}
                  style={{ margin: 0, marginRight: 4 }}
                />
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                  Estos montos no están incluidos en la caja actual
                </Text>
              </View>
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    padding: 10,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    margin: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  warningNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 158, 11, 0.3)',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
