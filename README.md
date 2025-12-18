# 🚗 Quili Wash - Sistema de Gestión para Lavadero de Vehículos

<div align="center">

![Quili Wash](https://img.shields.io/badge/Version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React_Native-0.76+-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=nodedotjs)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql)
![Expo](https://img.shields.io/badge/Expo-52+-000020?logo=expo)

**Sistema móvil completo para la gestión administrativa de lavaderos de vehículos**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Documentación](#-documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Autores](#-autores)

---

## 🎯 Descripción

**Quili Wash** es una aplicación móvil desarrollada con React Native y Expo que permite gestionar de manera eficiente las operaciones diarias de un lavadero de vehículos. El sistema está diseñado para el personal administrativo (administradores y secretarios) y ofrece control completo sobre servicios, pagos, comisiones y reportes.

### Problemática que Resuelve:
- ❌ Desorganización en registros manuales
- ❌ Pérdida de información en planillas físicas
- ❌ Errores en cálculos de comisiones
- ❌ Falta de reportes financieros confiables
- ❌ Control deficiente de pagos pendientes

---

## ✨ Características

### 🏠 Dashboard Principal
- 📊 Estadísticas en tiempo real (solo servicios pagados)
- 💰 Ingresos totales del día
- 🚗 Cantidad de servicios realizados
- 💸 Comisiones pagadas a lavadores
- 💎 Ganancia neta calculada automáticamente
- 👨‍🔧 Comisiones por lavador con detalles

### ➕ Registro de Servicios
- 🚙 Selección de tipo de vehículo (moto, auto, camioneta, camión)
- 🔤 Registro de placa (opcional)
- 🛠️ Selección de servicio con precio automático
- 👤 Asignación de lavador
- 💵 Cálculo automático de comisiones
- 📝 Campo de observaciones
- ✅ Estado de pago (Pendiente/Pagado)

### 💰 Cierre de Caja
- 📈 Estadísticas detalladas del día
- 📋 Lista completa de registros
- 🔍 Búsqueda por placa o lavador
- ✏️ Edición completa de registros
  - Cambiar servicio
  - Cambiar lavador
  - Modificar costo y porcentaje
  - Actualizar estado de pago
- 🗑️ Eliminación de registros
- ⏳ Vista separada de servicios pendientes

### 📜 Historial
- 📅 Consulta de servicios realizados
- 🔎 Búsqueda por placa
- 📊 Filtros por fecha
- 💳 Estado de pagos visible
- 🎨 Identificación visual por tipo de vehículo

### 👤 Perfil
- ℹ️ Información del usuario
- 🌓 Tema claro/oscuro automático
- 📱 Información de la app
- 🚪 Cierre de sesión seguro

### 🔄 Características Adicionales
- 📱 Auto-actualización al cambiar de pestaña
- 🎨 Diseño responsive (móvil y tablet)
- 🌙 Modo oscuro completo
- 🔐 Autenticación con JWT
- 💾 Almacenamiento seguro de credenciales
- 📶 Manejo de errores robusto

---

## 🛠️ Tecnologías

### Frontend (Móvil)
- **React Native** 0.76+ - Framework principal
- **Expo** 52+ - Desarrollo y build
- **TypeScript** - Tipado estático
- **React Native Paper** - Componentes UI
- **Axios** - Cliente HTTP
- **React Navigation** - Navegación entre pantallas
- **AsyncStorage** - Almacenamiento local

### Backend (API REST)
- **Node.js** 22+ - Runtime
- **Express** 4+ - Framework web
- **MySQL** 8+ - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Control de acceso
- **dotenv** - Variables de entorno

---

## 📦 Requisitos Previos

### Software Necesario:
```
✅ Node.js v22 o superior
✅ npm v10 o superior
✅ MySQL 8.0 o superior
✅ Git
✅ Expo Go app (para pruebas en móvil)
```

### Verificar Instalaciones:
```bash
node --version    # v22.19.0+
npm --version     # 10.x.x+
mysql --version   # 8.0+
git --version     # 2.x+
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TU-USUARIO/quili-wash-app.git
cd quili-wash-app
```

### 2. Configurar Base de Datos

#### Crear la base de datos:
```sql
CREATE DATABASE lavadero_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Importar estructura:
```bash
# Usar el archivo lavadero_db.sql (buscar en el proyecto)
mysql -u root -p lavadero_db < database/lavadero_db.sql
```

#### Datos de prueba (opcional):
```sql
-- Insertar usuario administrador (password: admin123)
INSERT INTO usuarios (nombre, email, password, rol, activo) 
VALUES ('Admin', 'admin@quiliwash.com', '$2a$10$hashaquí', 'admin', 1);

-- Insertar lavadores de prueba
INSERT INTO lavadores (nombre, apellido, activo) VALUES
('Juan', 'Pérez', 1),
('María', 'García', 1);

-- Insertar servicios base
INSERT INTO servicios (nombre, descripcion) VALUES
('Lavado Básico', 'Lavado exterior del vehículo'),
('Lavado Premium', 'Lavado exterior + interior + encerado');
```

### 3. Configurar Backend

```bash
cd quili-wash-backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

#### Editar `.env`:
```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=lavadero_db

# JWT
JWT_SECRET=tu_secreto_super_seguro_aquí

# Servidor
PORT=3000
```

#### Iniciar backend:
```bash
npm start
```

Deberías ver:
```
🚀 Servidor corriendo en puerto 3000
📡 Accesible en todas las interfaces de red
✅ Conexión a base de datos exitosa
```

### 4. Configurar Frontend

```bash
cd ../quili-wash

# Instalar dependencias
npm install
```

#### Configurar IP del servidor:

Edita `services/api.js` y cambia la IP a la de tu PC:

```javascript
// Si usas celular físico, cambia localhost por la IP de tu PC
const API_URL = 'http://192.168.X.X:3000/api';
```

Para obtener tu IP:
```bash
# Windows:
ipconfig

# Mac/Linux:
ifconfig
```

#### Iniciar aplicación:
```bash
npx expo start
```

### 5. Ejecutar en Dispositivo

**Opción A - Celular Físico:**
1. Instala **Expo Go** desde Play Store o App Store
2. Escanea el QR que aparece en la terminal
3. Asegúrate de estar en la misma red WiFi

**Opción B - Emulador Android:**
```bash
# Presiona 'a' en la terminal de Expo
```

**Opción C - Simulador iOS (solo Mac):**
```bash
# Presiona 'i' en la terminal de Expo
```

---

## ⚙️ Configuración

### Variables de Entorno (Backend)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `password123` |
| `DB_NAME` | Nombre de la base de datos | `lavadero_db` |
| `JWT_SECRET` | Secreto para tokens JWT | `mi-secreto-seguro-2024` |
| `PORT` | Puerto del servidor | `3000` |

### Configuración del Frontend

**`services/api.js`:**
```javascript
// Producción (servidor en la nube)
const API_URL = 'https://api.quiliwash.com/api';

// Desarrollo (servidor local)
const API_URL = 'http://192.168.1.100:3000/api';

// Timeout ajustable
timeout: 10000, // 10 segundos
```

---

## 📖 Uso

### Inicio de Sesión
1. Abre la aplicación
2. Ingresa credenciales:
   - **Email:** admin@quiliwash.com
   - **Password:** admin123
3. Click en "Iniciar Sesión"

### Registrar un Servicio
1. Ve a la pestaña **"Nuevo"**
2. Selecciona el tipo de vehículo
3. Ingresa la placa (opcional)
4. Selecciona el servicio (precio automático)
5. Ajusta el porcentaje de comisión si es necesario
6. Selecciona el lavador
7. Marca como "Pagado" o "Pendiente"
8. Click en **"Registrar Servicio"**

### Realizar Cierre de Caja
1. Ve a la pestaña **"Cierre"**
2. Revisa las estadísticas del día
3. Usa el buscador para encontrar registros específicos
4. Edita servicios si es necesario
5. Verifica que todos los pagos estén correctos
6. Usa pull-to-refresh para actualizar

### Consultar Historial
1. Ve a la pestaña **"Historial"**
2. Usa el buscador para filtrar por placa
3. Revisa el detalle de cada servicio
4. Verifica estados de pago

---

## 📁 Estructura del Proyecto

```
LAVADERO-MOBIL/
│
├── quili-wash/                    # 📱 FRONTEND
│   ├── app/
│   │   ├── (tabs)/                # Pantallas principales
│   │   │   ├── index.tsx          # Dashboard con estadísticas
│   │   │   ├── nuevo.tsx          # Registro de servicios
│   │   │   ├── cierre.tsx         # Cierre de caja
│   │   │   ├── historial.tsx      # Historial completo
│   │   │   └── perfil.tsx         # Perfil de usuario
│   │   └── screens/               # Pantallas auxiliares
│   │       └── LoginScreen.tsx    # Pantalla de login
│   ├── components/
│   │   └── ui/                    # Componentes reutilizables
│   ├── constants/
│   │   └── theme.ts               # Colores y temas
│   ├── contexts/
│   │   └── AuthContext.tsx        # Contexto de autenticación
│   ├── hooks/
│   │   └── use-color-scheme.ts    # Hook para tema
│   ├── services/
│   │   └── api.js                 # Configuración de Axios
│   ├── app.json                   # Configuración de Expo
│   ├── package.json
│   └── tsconfig.json
│
├── quili-wash-backend/            # 🔧 BACKEND
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Conexión MySQL
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── lavadoresController.js
│   │   │   ├── registrosController.js
│   │   │   └── serviciosController.js
│   │   ├── middlewares/
│   │   │   └── auth.js            # Middleware JWT
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── lavadoresRoutes.js
│   │   │   ├── registrosRoutes.js
│   │   │   └── serviciosRoutes.js
│   │   └── index.js               # Entrada principal
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── database/
│   └── lavadero_db.sql            # Estructura de BD
│
├── docs/                          # 📚 Documentación
│   ├── API.md                     # Documentación API
│   └── DIAGRAMAS.md               # Diagramas del sistema
│
├── .gitignore
└── README.md                      # Este archivo
```

---

## 🌐 API Endpoints

### Autenticación
```
POST   /api/auth/login          # Iniciar sesión
GET    /api/auth/verify         # Verificar token
```

### Lavadores
```
GET    /api/lavadores            # Obtener todos los lavadores
GET    /api/lavadores/comisiones # Comisiones por lavador (día)
```

### Servicios
```
GET    /api/servicios            # Obtener todos los servicios
GET    /api/servicios/vehiculo/:tipo # Servicios por tipo de vehículo
```

### Registros
```
POST   /api/registros            # Crear registro
GET    /api/registros            # Obtener registros (con filtros)
GET    /api/registros/cierre-caja # Estadísticas del día
PUT    /api/registros/:id        # Actualizar registro
DELETE /api/registros/:id        # Eliminar registro
```

**Ver documentación completa:** [API.md](docs/API.md)

---

## 📸 Capturas de Pantalla

### Dashboard
<div align="center">
<img src="docs/screenshots/dashboard.png" width="250" alt="Dashboard">
<img src="docs/screenshots/dashboard-dark.png" width="250" alt="Dashboard Modo Oscuro">
</div>

### Registro de Servicios
<div align="center">
<img src="docs/screenshots/nuevo.png" width="250" alt="Nuevo Servicio">
</div>

### Cierre de Caja
<div align="center">
<img src="docs/screenshots/cierre.png" width="250" alt="Cierre de Caja">
</div>

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

### Pasos para contribuir:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guía de estilo:
- Usar TypeScript en el frontend
- Seguir convenciones de nombres
- Agregar comentarios en código complejo
- Actualizar documentación si es necesario

---

## 🐛 Reporte de Bugs

¿Encontraste un bug? Por favor:
1. Verifica que no esté reportado en [Issues](https://github.com/TU-USUARIO/quili-wash-app/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Screenshots si es posible
   - Versión de la app y sistema operativo

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

### Equipo de Desarrollo - Universidad del Valle

**María Victoria Carabalí Caicedo**
- 📧 Email: maria.victoria.carabali@correounivalle.edu.co
- 🎓 Código: 202358430

**Jean Carlos Campo Gracia**
- 📧 Email: jean.campo@correounivalle.edu.co
- 🎓 Código: 202376467

**Stefany Yotengo Acosta**
- 📧 Email: stefany.yotengo@correounivalle.edu.co
- 🎓 Código: 202376584

### Docente
**Wilson Arley Rodríguez**
- 📚 Curso: Diseño de Contenido para Interfaces de Usuario
- 🏫 Facultad de Ingeniería - Programa de Tecnología en Desarrollo de Software
- 📍 Santander de Quilichao, Cauca, Colombia

---

## 🙏 Agradecimientos

- Universidad del Valle - Sede Norte del Cauca
- Programa de Tecnología en Desarrollo de Software
- Comunidad de React Native
- Documentación de Expo
- Todos los colaboradores del proyecto

---

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: soporte@quiliwash.com
- 📱 WhatsApp: +57 300 123 4567
- 🌐 Website: https://quiliwash.com
- 💬 Discord: [Servidor de la comunidad]

---

## 🗺️ Roadmap

### Versión 1.1 (Q1 2025)
- [ ] Generación de reportes PDF
- [ ] Gráficas de estadísticas
- [ ] Notificaciones push
- [ ] Backup automático

### Versión 2.0 (Q2 2025)
- [ ] Reconocimiento de placas con cámara
- [ ] Sistema de inventario
- [ ] App para lavadores
- [ ] Integración con pasarelas de pago

---

<div align="center">

**Desarrollado con ❤️ en Colombia 🇨🇴**

[![GitHub Stars](https://img.shields.io/github/stars/TU-USUARIO/quili-wash-app?style=social)](https://github.com/TU-USUARIO/quili-wash-app)
[![GitHub Forks](https://img.shields.io/github/forks/TU-USUARIO/quili-wash-app?style=social)](https://github.com/TU-USUARIO/quili-wash-app)

[⬆ Volver arriba](#-quili-wash---sistema-de-gestión-para-lavadero-de-vehículos)

</div>
