# 🚦 ANTHEM SafeMove - Frontend

Aplicación web frontend para el sistema de seguridad vial y movilidad inteligente de Madrid.

## 🚀 Tecnologías

- **React 19.2.3** - Framework UI
- **Vite 7.3.0** - Build tool y dev server
- **React Router DOM 7.1.3** - Navegación y routing
- **Leaflet 1.9.4** + **React-Leaflet 5.0.0** - Mapas interactivos
- **Recharts 3.6.0** - Gráficas y visualizaciones
- **Context API** - Gestión de estado de autenticación

---

## 📦 Instalación

```bash
npm install
```

### Dependencias principales:
```json
{
  "react": "^19.2.3",
  "react-router-dom": "^7.1.3",
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "recharts": "^3.6.0"
}
```

---

## ⚙️ Configuración

El frontend se conecta al backend en `http://localhost:5000/api` por defecto.

Para cambiar la URL del backend, modifica la constante `API_URL` en los componentes que la utilizan.

---

## 🏃 Ejecución

```bash
# Modo desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:3001**

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 🗂️ Estructura del Proyecto

```
SSIIUU_Frontend/
├── src/
│   ├── main.jsx                # Punto de entrada
│   ├── App.jsx                 # Router principal
│   ├── App.css                 # Estilos globales
│   ├── components/             # Componentes React
│   │   ├── Login.jsx           # Página de inicio de sesión
│   │   ├── Register.jsx        # Registro de nuevos usuarios
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   ├── DashboardPage.jsx   # Dashboard principal
│   │   ├── Dashboard.jsx       # Contenido del dashboard
│   │   ├── MapView.jsx         # Mapa de accidentes con Leaflet
│   │   ├── AnalysisPage.jsx    # Análisis avanzado con gráficas
│   │   ├── ScoringPage.jsx     # Scoring predictivo de riesgo
│   │   ├── AdminPage.jsx       # Gestión de usuarios (admin)
│   │   ├── ProtectedRoute.jsx  # HOC para protección de rutas
│   │   └── *.css               # Estilos de cada componente
│   └── context/
│       └── AuthContext.jsx     # Context API de autenticación
├── index.html                  # HTML base
├── vite.config.js              # Configuración de Vite
└── package.json
```

---

## 🎨 Componentes Principales

### 🔐 **Autenticación**

#### **Login.jsx**
- Formulario de inicio de sesión
- Validación de credenciales
- Redirección al dashboard tras login exitoso
- Enlace a página de registro

#### **Register.jsx**
- Formulario de registro de usuarios
- Campos: nombre, email, password, rol
- Validación de datos
- Redirección automática tras registro

#### **AuthContext.jsx**
- Context API global para autenticación
- Gestión de estado del usuario y token
- Funciones: `login()`, `logout()`, `verificarToken()`
- Persistencia en `localStorage`

---

### 🧭 **Navegación**

#### **Navbar.jsx**
- Barra de navegación responsive
- Enlaces dinámicos según rol del usuario
- Indicador visual del rol (badge)
- Botón de logout
- Menú hamburguesa en móvil

#### **ProtectedRoute.jsx**
- Higher-Order Component para proteger rutas
- Verifica autenticación y rol del usuario
- Redirecciona a `/login` si no autenticado
- Redirecciona a `/dashboard` si no tiene permisos

---

### 📊 **Dashboard y Visualizaciones**

#### **DashboardPage.jsx**
- Wrapper del dashboard principal
- Carga inicial de datos del backend
- Gestión de estado de loading

#### **Dashboard.jsx**
- Vista principal con KPIs
- Contenido dinámico según rol:
  - **Ciudadano**: KPIs básicos, mapa de accidentes
  - **Gestor**: + Análisis avanzado, scoring de riesgo
  - **Admin**: + Gestión de usuarios
- Cards con estadísticas principales
- Grid responsive

#### **MapView.jsx**
- Mapa interactivo con Leaflet
- Marcadores de accidentes coloreados por gravedad:
  - 🔴 Fallecidos
  - 🟠 Graves
  - 🟡 Leves
  - ⚪ Sin datos
- Popup con detalles de cada accidente
- Cluster de marcadores para mejor rendimiento
- Centrado en Madrid (40.4168, -3.7038)

#### **AnalysisPage.jsx** (Gestor/Admin)
- 4 visualizaciones con Recharts:
  1. **Accidentes por Hora** - Bar chart con 24 horas
  2. **Accidentes por Distrito** - Bar chart top distritos
  3. **Accidentes por Tipo** - Bar chart por categoría
  4. **Vehículos Implicados** - Pie chart proporcional
- Filtros avanzados
- Exportación de datos

#### **ScoringPage.jsx** (Gestor/Admin)
- **Top 10 Zonas de Mayor Riesgo** - Cards clicables
- **Patrones Horarios** - 5 horas más peligrosas
- **Análisis Horario por Distrito** - Tabla interactiva con 24 horas
- **Modelo Predictivo de IA**:
  - Densidad de accidentes (×2)
  - Severidad (graves×15 + fallecidos×30)
  - Casos con alcohol (×8)
  - Diversidad de tipos (×3)
- Normalización logarítmica 0-100
- Indicadores de tendencia (📈 Creciente, ➡️ Estable, 📉 Decreciente)
- Probabilidad de accidente (%)
- Ordenación por cualquier columna
- Selección de distrito para análisis detallado

#### **AdminPage.jsx** (Admin)
- **CRUD completo de usuarios**
- Tabla de usuarios con filtros
- Modal para crear/editar usuarios
- Confirmación de eliminación
- Badges de rol con colores
- Validaciones de formulario

---

## 🛣️ Rutas de la Aplicación

### **Públicas** (sin autenticación)
| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/login` | Login | Inicio de sesión |
| `/registro` | Register | Registro de usuarios |

### **Privadas** (requieren login)
| Ruta | Componente | Roles | Descripción |
|------|-----------|-------|-------------|
| `/` | → `/dashboard` | Todos | Redirección principal |
| `/dashboard` | DashboardPage | Todos | Dashboard principal |
| `/analisis` | AnalysisPage | Gestor, Admin | Análisis avanzado |
| `/scoring` | ScoringPage | Gestor, Admin | Scoring predictivo |
| `/admin` | AdminPage | Admin | Gestión de usuarios |

---

## 🎨 Sistema de Estilos

### **Paleta de Colores**
```css
/* Gradientes principales */
--gradient-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-blue: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

/* Estados de severidad */
--color-fallecido: #dc2626;    /* Rojo */
--color-grave: #ea580c;        /* Naranja */
--color-leve: #f59e0b;         /* Amarillo */
--color-sin-datos: #9ca3af;   /* Gris */

/* Roles */
--color-admin: #dc2626;        /* Rojo */
--color-gestor: #ea580c;       /* Naranja */
--color-ciudadano: #3b82f6;    /* Azul */
```

### **Diseño Responsive**
- Mobile-first approach
- Breakpoint principal: `768px`
- Grid adaptativo en dashboard
- Menú hamburguesa en móvil
- Tablas con scroll horizontal

---

## 🔐 Roles y Permisos

### **👤 Ciudadano**
**Acceso:**
- ✅ Dashboard con KPIs generales
- ✅ Mapa de accidentes
- ❌ Análisis avanzados
- ❌ Scoring de riesgo
- ❌ Administración

### **👮 Gestor**
**Acceso:**
- ✅ Todo lo del ciudadano
- ✅ Página de análisis con gráficas
- ✅ Scoring predictivo de riesgo
- ❌ Administración de usuarios

### **🔧 Admin**
**Acceso:**
- ✅ Acceso total
- ✅ Gestión de usuarios (CRUD)
- ✅ Todas las funcionalidades

---

## 🔑 Credenciales de Prueba

```bash
# Ciudadano
Email: ciudadano@anthem.com
Password: ciudadano123

# Gestor
Email: gestor@anthem.com
Password: gestor123

# Admin
Email: admin@anthem.com
Password: admin123
```

---

## 🔄 Flujo de Autenticación

```
1. Usuario accede → Redirige a /login
2. Ingresa credenciales → POST /api/auth/login
3. Backend valida → Devuelve JWT token
4. Frontend guarda token en localStorage
5. AuthContext actualiza estado global
6. Redirige a /dashboard
7. Cada request incluye header: Authorization: Bearer <token>
8. Componentes verifican rol para mostrar contenido
9. Logout → Limpia localStorage → Redirige a /login
```

---

## 📡 Integración con Backend

### **Endpoints Consumidos**

#### **Autenticación**
```javascript
POST /api/auth/login          // Login
POST /api/auth/registro       // Registro
GET  /api/auth/perfil         // Perfil usuario
GET  /api/auth/verificar      // Verificar token
```

#### **KPIs y Datos**
```javascript
GET /api/kpis/general         // KPIs dashboard
GET /api/kpis/riesgo          // Scoring predictivo
GET /api/accidentes/heatmap   // Datos para mapa
```

#### **Administración**
```javascript
GET    /api/usuarios          // Listar usuarios
POST   /api/usuarios          // Crear usuario
PUT    /api/usuarios/:id      // Actualizar usuario
DELETE /api/usuarios/:id      // Eliminar usuario
```

### **Headers de Autenticación**
```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

---

## 🎯 Características Destacadas

### ✨ **Mapa Interactivo**
- Visualización de 32,000+ accidentes
- Colores según severidad
- Popups informativos
- Clustering para rendimiento
- Zoom y pan suaves

### 📊 **Análisis Avanzado**
- 4 tipos de gráficas interactivas
- Datos actualizados en tiempo real
- Colores consistentes con la marca
- Tooltips informativos
- Responsive en todos los dispositivos

### 🤖 **Modelo Predictivo de IA**
- Scoring 0-100 normalizado
- Multi-factor: densidad, severidad, alcohol, diversidad
- Tendencias predictivas
- Probabilidad de accidente
- Análisis horario detallado por distrito
- Patrones de alto riesgo

### 🔐 **Seguridad**
- Tokens JWT con expiración
- Rutas protegidas por rol
- Validación en frontend y backend
- Sanitización de inputs
- Persistencia segura en localStorage

### 🎨 **UX/UI**
- Diseño moderno y limpio
- Gradientes y animaciones sutiles
- Feedback visual en todas las acciones
- Loading states
- Mensajes de error/éxito
- Responsive design completo

---

## 🐛 Debugging

### **Ver estado de autenticación:**
```javascript
// En consola del navegador
localStorage.getItem('token')
```

### **Limpiar sesión:**
```javascript
localStorage.clear()
window.location.reload()
```

### **Verificar permisos:**
- Revisa el badge de rol en la navbar
- Comprueba que las rutas protegidas redirigen correctamente
- Verifica que los componentes muestran/ocultan según rol

---

## 📦 Build para Producción

```bash
# Generar build optimizado
npm run build

# La carpeta dist/ contendrá los archivos estáticos
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
```

### **Despliegue**
El build generado es estático y puede desplegarse en:
- Netlify
- Vercel
- GitHub Pages
- Servidor web estándar (Apache, Nginx)

**Importante:** Configurar el servidor para redirigir todas las rutas a `index.html` (SPA routing).

---

## 🔧 Configuración de Vite

```javascript
// vite.config.js
export default {
  server: {
    port: 3001,  // Puerto del dev server
    open: true   // Abrir navegador automáticamente
  }
}
```

---

## ✅ Testing Manual

### **1. Autenticación**
- [ ] Login con credenciales correctas
- [ ] Rechazo de credenciales incorrectas
- [ ] Registro de nuevo usuario
- [ ] Persistencia de sesión tras refresh
- [ ] Logout correcto

### **2. Navegación**
- [ ] Menú muestra enlaces según rol
- [ ] Rutas protegidas redirigen correctamente
- [ ] Badge de rol visible en navbar
- [ ] Responsive: menú hamburguesa funcional

### **3. Dashboard**
- [ ] KPIs cargan correctamente
- [ ] Mapa muestra marcadores
- [ ] Popups de accidentes funcionan
- [ ] Contenido dinámico según rol

### **4. Análisis (Gestor/Admin)**
- [ ] 4 gráficas renderizan correctamente
- [ ] Datos coherentes con backend
- [ ] Tooltips informativos
- [ ] Responsive en móvil

### **5. Scoring (Gestor/Admin)**
- [ ] Top 10 zonas muestra datos
- [ ] Clic en distrito carga tabla horaria
- [ ] 24 horas visibles por distrito
- [ ] Ordenación por columnas funciona
- [ ] Badges de riesgo coloreados
- [ ] Tendencias e indicadores visibles

### **6. Admin (Admin)**
- [ ] Tabla de usuarios carga
- [ ] Crear usuario funciona
- [ ] Editar usuario actualiza datos
- [ ] Eliminar usuario con confirmación
- [ ] Modal abre/cierra correctamente
- [ ] Validaciones de formulario

---

## 📚 Recursos

- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **React Router**: https://reactrouter.com/
- **Leaflet**: https://leafletjs.com/
- **Recharts**: https://recharts.org/

---

## 👨‍💻 Autor

**Marco Muñoz García**  
Sistemas de Información Ubicuos - UCLM  
Curso 2025-2026

---

## 📄 Licencia

Proyecto académico - UCLM

---

**ANTHEM SafeMove** 🚦 - Seguridad vial y movilidad inteligente para Madrid
