import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Modal, 
  FlatList, 
  TouchableOpacity,
  Pressable 
} from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, IconButton } from 'react-native-paper';
import api from '../../services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFocusEffect } from '@react-navigation/native';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

interface Lavador {
  id: number;
  nombre: string;
  apellido: string;
}

type TipoVehiculo = 'motorcycle' | 'car' | 'pickup' | 'truck';

export default function NuevoScreen() {
  const [vehiculo, setVehiculo] = useState<TipoVehiculo>('car');
  const [placa, setPlaca] = useState('');
  const [servicio, setServicio] = useState<number | null>(null);
  const [servicioNombre, setServicioNombre] = useState('Seleccionar servicio');
  const [costo, setCosto] = useState('');
  const [porcentaje, setPorcentaje] = useState('50');
  const [lavador, setLavador] = useState<number | null>(null);
  const [lavadorNombre, setLavadorNombre] = useState('Seleccionar lavador');
  const [observaciones, setObservaciones] = useState('');
  const [pago, setPago] = useState('Pendiente');

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [lavadores, setLavadores] = useState<Lavador[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ✅ Usar Modal en lugar de Menu
  const [modalServicioVisible, setModalServicioVisible] = useState(false);
  const [modalLavadorVisible, setModalLavadorVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarLavadores();
    }, [])
  );

  useEffect(() => {
    if (vehiculo) {
      cargarServicios(vehiculo);
    }
  }, [vehiculo]);

  const cargarLavadores = async () => {
    try {
      const response = await api.get('/lavadores');
      setLavadores(response.data.lavadores);
    } catch (error) {
      console.error('Error al cargar lavadores:', error);
    }
  };

  const cargarServicios = async (tipoVehiculo: TipoVehiculo) => {
    try {
      const response = await api.get(`/servicios/vehiculo/${tipoVehiculo}`);
      setServicios(response.data.servicios);
      setServicio(null);
      setServicioNombre('Seleccionar servicio');
      setCosto('');
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  // ✅ Funciones simplificadas sin setTimeout
  const seleccionarServicio = (srv: Servicio) => {
    setServicio(srv.id);
    setServicioNombre(srv.nombre);
    setCosto(srv.precio.toString());
    setModalServicioVisible(false);
  };

  const seleccionarLavador = (lav: Lavador) => {
    setLavador(lav.id);
    setLavadorNombre(`${lav.nombre} ${lav.apellido}`);
    setModalLavadorVisible(false);
  };

  const handleSubmit = async () => {
    if (!servicio) {
      Alert.alert('Error', 'Selecciona un servicio');
      return;
    }
    if (!costo) {
      Alert.alert('Error', 'Ingresa el costo del servicio');
      return;
    }
    if (!lavador) {
      Alert.alert('Error', 'Selecciona un lavador');
      return;
    }

    setLoading(true);

    try {
      await api.post('/registros', {
        vehiculo,
        placa: placa.trim() || null,
        id_servicio: servicio,
        costo: parseFloat(costo),
        porcentaje: parseFloat(porcentaje),
        id_lavador: lavador,
        observaciones: observaciones.trim() || null,
        pago,
      });

      Alert.alert('Éxito', 'Registro creado correctamente');
      
      setPlaca('');
      setServicio(null);
      setServicioNombre('Seleccionar servicio');
      setCosto('');
      setPorcentaje('50');
      setLavador(null);
      setLavadorNombre('Seleccionar lavador');
      setObservaciones('');
      setPago('Pendiente');

    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el registro');
      console.error('Error al crear registro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Estilos dinámicos
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    sectionTitle: {
      marginTop: 20,
      marginBottom: 12,
      fontWeight: 'bold',
      color: colors.text,
    },
    input: {
      marginBottom: 16,
      backgroundColor: colors.background,
    },
    selectButton: {
      marginBottom: 16,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    // Estilos del Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      width: '85%',
      maxHeight: '70%',
      padding: 0,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    modalItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalItemText: {
      fontSize: 16,
      color: colors.text,
    },
    modalItemSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    emptyModalText: {
      padding: 32,
      textAlign: 'center',
      color: colors.textSecondary,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
        Tipo de Vehículo
      </Text>
      <SegmentedButtons
        value={vehiculo}
        onValueChange={(value) => setVehiculo(value as TipoVehiculo)}
        buttons={[
          { value: 'motorcycle', label: 'Moto' },
          { value: 'car', label: 'Auto' },
          { value: 'pickup', label: 'Camioneta' },
          { value: 'truck', label: 'Camión' },
        ]}
        style={styles.segmented}
      />

      <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
        Datos del Vehículo
      </Text>

      <TextInput
        label="Placa (Opcional)"
        value={placa}
        onChangeText={setPlaca}
        mode="outlined"
        style={dynamicStyles.input}
        autoCapitalize="characters"
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        textColor={colors.text}
      />

      {/* ✅ BOTÓN PARA ABRIR MODAL DE SERVICIOS */}
      <Button
        mode="outlined"
        onPress={() => setModalServicioVisible(true)}
        icon="car-wash"
        style={dynamicStyles.selectButton}
        contentStyle={styles.selectButtonContent}
        textColor={colors.text}
        disabled={servicios.length === 0}
      >
        {servicioNombre}
      </Button>

      <TextInput
        label="Costo"
        value={costo}
        onChangeText={setCosto}
        mode="outlined"
        keyboardType="numeric"
        style={dynamicStyles.input}
        left={<TextInput.Icon icon="currency-usd" />}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        textColor={colors.text}
      />

      <TextInput
        label="Porcentaje de Comisión"
        value={porcentaje}
        onChangeText={setPorcentaje}
        mode="outlined"
        keyboardType="numeric"
        style={dynamicStyles.input}
        left={<TextInput.Icon icon="percent" />}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        textColor={colors.text}
      />

      {/* ✅ BOTÓN PARA ABRIR MODAL DE LAVADORES */}
      <Button
        mode="outlined"
        onPress={() => setModalLavadorVisible(true)}
        icon="account"
        style={dynamicStyles.selectButton}
        contentStyle={styles.selectButtonContent}
        textColor={colors.text}
        disabled={lavadores.length === 0}
      >
        {lavadorNombre}
      </Button>

      <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
        Estado de Pago
      </Text>
      <SegmentedButtons
        value={pago}
        onValueChange={setPago}
        buttons={[
          { value: 'Pendiente', label: 'Pendiente' },
          { value: 'Pagado', label: 'Pagado' },
        ]}
        style={styles.segmented}
      />

      <TextInput
        label="Observaciones (Opcional)"
        value={observaciones}
        onChangeText={setObservaciones}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={dynamicStyles.input}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        textColor={colors.text}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        buttonColor={colors.primary}
      >
        Registrar Servicio
      </Button>

      {/* ✅ MODAL DE SERVICIOS */}
      <Modal
        visible={modalServicioVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalServicioVisible(false)}
      >
        <Pressable 
          style={dynamicStyles.modalOverlay}
          onPress={() => setModalServicioVisible(false)}
        >
          <Pressable 
            style={dynamicStyles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Seleccionar Servicio</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalServicioVisible(false)}
                iconColor={colors.text}
              />
            </View>
            
            {servicios.length === 0 ? (
              <Text style={dynamicStyles.emptyModalText}>
                No hay servicios disponibles
              </Text>
            ) : (
              <FlatList
                data={servicios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={dynamicStyles.modalItem}
                    onPress={() => seleccionarServicio(item)}
                  >
                    <Text style={dynamicStyles.modalItemText}>{item.nombre}</Text>
                    <Text style={dynamicStyles.modalItemSubtext}>
                      ${item.precio.toLocaleString('es-CO')}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* ✅ MODAL DE LAVADORES */}
      <Modal
        visible={modalLavadorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalLavadorVisible(false)}
      >
        <Pressable 
          style={dynamicStyles.modalOverlay}
          onPress={() => setModalLavadorVisible(false)}
        >
          <Pressable 
            style={dynamicStyles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Seleccionar Lavador</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalLavadorVisible(false)}
                iconColor={colors.text}
              />
            </View>
            
            {lavadores.length === 0 ? (
              <Text style={dynamicStyles.emptyModalText}>
                Cargando lavadores...
              </Text>
            ) : (
              <FlatList
                data={lavadores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={dynamicStyles.modalItem}
                    onPress={() => seleccionarLavador(item)}
                  >
                    <Text style={dynamicStyles.modalItemText}>
                      {item.nombre} {item.apellido}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  segmented: {
    marginBottom: 8,
  },
  selectButtonContent: {
    justifyContent: 'flex-start',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 8,
  },
});