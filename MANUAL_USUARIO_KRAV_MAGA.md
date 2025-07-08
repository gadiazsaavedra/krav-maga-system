# 🥋 Manual de Usuario - Sistema Krav Maga

## 📖 Índice
1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Panel Principal](#panel-principal)
4. [Módulos Principales](#módulos-principales)
5. [Flujos de Trabajo](#flujos-de-trabajo)
6. [Consejos y Trucos](#consejos-y-trucos)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Introducción

### ¿Qué es el Sistema Krav Maga?
Sistema integral diseñado específicamente para la gestión completa de clubes de Krav Maga. Permite administrar alumnos, pagos, inventario, exámenes y más desde cualquier dispositivo.

### Características Principales
- ✅ **Mobile First** - Optimizado para celulares y tablets
- ✅ **6 Módulos Completos** - Todas las funciones necesarias
- ✅ **Datos en Tiempo Real** - Sincronización automática
- ✅ **Sin Instalación** - Funciona desde el navegador

---

## 🌐 Acceso al Sistema

### URL del Sistema
**https://krav-maga-sys.netlify.app**

### Dispositivos Compatibles
- 📱 **Smartphones** (Android/iPhone)
- 📱 **Tablets** (iPad/Android)
- 💻 **Computadoras** (Windows/Mac/Linux)
- 🌐 **Navegadores** (Chrome, Firefox, Safari, Edge)

### Primer Acceso
1. Abrir la URL en el navegador
2. El sistema carga automáticamente
3. Todos los datos se guardan localmente
4. No requiere registro ni login

---

## 🏠 Panel Principal

### Vista General
El panel principal está diseñado para el flujo de trabajo diario de un instructor:

#### 🎯 CLASE EN CURSO
- **Seleccionar Turno** - Elige el horario actual
- **Cinturones del Turno** - Ve qué niveles corresponden
- **Información Contextual** - Día, hora y alumnos esperados

#### 1️⃣ TOMAR ASISTENCIA
- **Botón Principal** - "✅ MARCAR PRESENTES"
- **Lista de Alumnos** - Solo los del turno seleccionado
- **Toggle Rápido** - Presente/Ausente con un toque
- **Guardado Automático** - Se registra inmediatamente

#### 2️⃣ ÚLTIMA CLASE RECORDATORIO
- **Tema Anterior** - Qué se vio la clase pasada
- **Tipo de Clase** - Nuevo tema o repaso
- **Notas del Instructor** - Observaciones importantes
- **Alerta de Morosos** - Si hay alumnos con pagos pendientes

#### 3️⃣ OPCIONES PARA HOY
- **🔄 Repaso** - Repasar tema anterior
- **🆕 Tema Nuevo** - Introducir nuevo contenido
- **📚 Temario** - Consultar programa completo

#### 🏛️ PANEL DE CONTROL AVANZADO
- **Acceso a Todas las Funciones** - Botón principal
- **6 Módulos Completos** - Gestión integral

---

## 📊 Módulos Principales

### 👥 1. Gestión de Alumnos

#### Funciones Principales
- **➕ Crear Alumnos** - Formulario completo (nombre, apellido, teléfono, cinturón)
- **✏️ Editar Información** - Modificar datos existentes
- **🔍 Buscar Alumnos** - Filtro por nombre
- **📋 Lista Completa** - Todos los alumnos registrados

#### Cómo Usar
1. **Nuevo Alumno**: Panel Principal → "Nuevo Alumno"
2. **Completar Datos**: Nombre, apellido, teléfono, cinturón inicial
3. **Guardar**: Se registra automáticamente
4. **Aparece Automáticamente**: En renovaciones y mensualidades

#### Datos que se Registran
- Información personal básica
- Cinturón actual
- Fecha de registro
- Historial de pagos (automático)
- Asistencias (automático)

---

### 💰 2. Mensualidades

#### Funciones Principales
- **💳 Control de Pagos** - Estado actual de cada alumno
- **🚨 Detección de Morosos** - Alerta automática
- **📞 Contacto Rápido** - Llamar o WhatsApp directo
- **⚙️ Configuración** - Montos y reglas personalizables

#### Estados de Pago
- **🟢 PAGADO** - Alumno al día
- **🔴 PENDIENTE** - Pago vencido
- **🟡 Continuo** - $25.000 (sin faltas)
- **🟠 Interrumpido** - $30.000 (con faltas excesivas)

#### Cómo Usar
1. **Ver Estado**: Panel → "Todas las Funciones" → "Mensualidades"
2. **Marcar Pagado**: Botón en cada alumno
3. **Gestionar Faltas**: +1 Falta / Reset Faltas
4. **Contactar Morosos**: Botones de llamada/WhatsApp

#### Configuración Avanzada
- **Monto Continuo**: Para alumnos regulares
- **Monto Interrumpido**: Para alumnos con faltas
- **Tolerancia de Faltas**: Límite antes de aumentar monto
- **Reglas Automáticas**: El sistema calcula automáticamente

---

### 📅 3. Renovaciones Anuales

#### Funciones Principales
- **📋 Control de Requisitos** - Ficha, certificado médico, pago
- **✅ Checkboxes Interactivos** - Marcar completado
- **📊 Estados Visuales** - Completo/Pendiente
- **💰 Control de Pagos** - Monto configurable

#### Requisitos por Alumno
1. **📄 Ficha Completada** - Datos actualizados
2. **🏥 Certificado Médico** - Apto físico vigente
3. **💳 Pago Realizado** - Renovación anual

#### Cómo Usar
1. **Acceder**: Panel → "Renovaciones Anuales"
2. **Filtrar**: Todos/Completo/Pendiente/Sin Pago
3. **Marcar Requisitos**: Click en checkboxes
4. **Seguimiento**: Estado se actualiza automáticamente

#### Estados Automáticos
- **🟢 COMPLETO** - Todos los requisitos cumplidos
- **🟡 PENDIENTE** - Faltan requisitos
- **Fechas Automáticas** - Se registran al marcar completado

---

### 🛍️ 4. Tienda/Indumentaria

#### Gestión de Pedidos
- **📝 Crear Pedidos** - Alumno, producto, talla, precio
- **📦 Estados de Pedido** - Pedido → Recibido → Entregado
- **💰 Control de Pagos** - Pagado/Sin pagar
- **📊 Seguimiento Completo** - Historial de cada pedido

#### Gestión de Stock
- **📦 Control de Inventario** - Cantidad por producto/talla
- **⚠️ Alertas de Stock** - Bajo/Sin stock
- **💰 Precios Dinámicos** - Editable por producto
- **📊 Stock Mínimo** - Configurable por item

#### Productos Disponibles
- 👕 Remeras (S, M, L, XL, XXL)
- 🩳 Shorts (M, L, XL)
- 👖 Pantalones (M, L, XL)
- 🥊 Guantes (L, Único)
- 🦷 Protectores Bucales (Único)

#### Flujo de Trabajo
1. **Cliente Solicita** → Crear Pedido
2. **Verificar Stock** → Sistema alerta si no hay
3. **Pedido Confirmado** → Estado "Pedido"
4. **Mercadería Llega** → Cambiar a "Recibido" (descuenta stock)
5. **Cliente Retira** → Cambiar a "Entregado"

---

### 🥋 5. Exámenes de Cinturón

#### Gestión de Exámenes
- **📋 Historial Completo** - Exámenes pasados
- **📅 Próximos Exámenes** - Candidatos seleccionados
- **✅ Control de Requisitos** - Formulario y pago
- **🏆 Resultados** - Aprobado/No Aprobado/Pendiente

#### Requisitos por Examen
1. **📄 Formulario Completado** - Datos del candidato
2. **💳 Pago Realizado** - Monto según cinturón objetivo
3. **📅 Fecha Programada** - Examen agendado

#### Montos por Cinturón
- 🤍 **Blanco** → $8.000
- 🟡 **Amarillo** → $9.000
- 🟠 **Naranja** → $10.000
- 🟢 **Verde** → $11.000
- 🔵 **Azul** → $12.000
- 🟤 **Marrón** → $13.000
- ⚫ **Negro** → $15.000

#### Flujo de Examen
1. **Seleccionar Candidato** → Agregar a próximo examen
2. **Verificar Requisitos** → Formulario y pago
3. **Día del Examen** → Evaluar desempeño
4. **Registrar Resultado** → Aprobar/No aprobar
5. **Actualizar Cinturón** → Si aprueba (manual)

---

### 📚 6. Temario y Clases

#### Gestión de Temario
- **📖 Temario por Cinturón** - Programa completo
- **✏️ Editar Temas** - Personalizar contenido
- **➕ Agregar Temas** - Expandir programa
- **🗑️ Eliminar Temas** - Limpiar contenido

#### Registro de Clases
- **📝 Nueva Clase** - Fecha, cinturón, tema, tipo
- **📊 Historial** - Clases anteriores
- **💡 Sugerencias** - Qué dar según última clase
- **📝 Notas** - Observaciones del instructor

#### Tipos de Clase
- **🆕 Tema Nuevo** - Introducir contenido
- **🔄 Repaso** - Reforzar conocimiento

#### Temario por Cinturón

**🤍 Blanco**
- Posición de guardia
- Golpes básicos (puño, palma)
- Patadas básicas
- Defensa contra empujón
- Caída hacia atrás
- Liberación de agarres básicos

**🟡 Amarillo**
- Defensa contra agarres de muñeca
- Defensa contra estrangulación frontal
- Golpes de rodilla
- Patada frontal
- Combinaciones básicas
- Caída lateral

**🟠 Naranja**
- Defensa contra agarres por detrás
- Defensa contra estrangulación lateral
- Golpes de codo
- Patada circular
- Trabajo en el suelo básico
- Defensa contra empujón con dos manos

**🟢 Verde**
- Defensa contra oso (bear hug)
- Defensa contra headlock
- Patadas altas
- Combinaciones avanzadas
- Defensa en el suelo
- Defensa contra múltiples atacantes

**🔵 Azul**
- Defensa contra armas blancas
- Defensa contra palo/bastón
- Técnicas de desarme
- Combate en espacios reducidos
- Defensa contra amenaza de arma
- Técnicas de control

**🟤 Marrón**
- Defensa contra arma de fuego
- Técnicas de protección de terceros
- Combate avanzado
- Situaciones de estrés
- Defensa en vehículos
- Técnicas de instructor

---

## 🔄 Flujos de Trabajo

### 📅 Rutina Diaria del Instructor

#### Antes de la Clase (5 minutos)
1. **Abrir Sistema** → URL en el navegador
2. **Seleccionar Turno** → Horario actual
3. **Revisar Última Clase** → Qué tema se vio
4. **Planificar Clase** → Nuevo tema o repaso
5. **Verificar Morosos** → Si aparece alerta

#### Durante la Clase (2 minutos)
1. **Tomar Asistencia** → "✅ MARCAR PRESENTES"
2. **Lista de Alumnos** → Solo los del turno
3. **Toggle Rápido** → Presente/Ausente
4. **Automático** → Se guarda al instante

#### Después de la Clase (3 minutos)
1. **Registrar Clase** → Tema dado y tipo
2. **Agregar Notas** → Observaciones importantes
3. **Revisar Pendientes** → Pagos o renovaciones
4. **Planificar Siguiente** → Qué tema sigue

### 💰 Gestión de Pagos Mensual

#### Inicio de Mes
1. **Revisar Mensualidades** → Estado de cada alumno
2. **Identificar Morosos** → Alerta automática
3. **Contactar Pendientes** → Llamar/WhatsApp
4. **Actualizar Pagos** → Marcar como pagado

#### Durante el Mes
1. **Recibir Pagos** → Marcar inmediatamente
2. **Gestionar Faltas** → +1 por inasistencia
3. **Monitorear Estados** → Continuo/Interrumpido
4. **Seguimiento** → Contacto con morosos

### 📋 Renovaciones Anuales

#### Preparación (Enero/Febrero)
1. **Revisar Lista** → Todos los alumnos
2. **Solicitar Documentos** → Ficha y certificado
3. **Informar Montos** → Renovación anual
4. **Establecer Fechas** → Límite de entrega

#### Seguimiento
1. **Marcar Requisitos** → Según se completen
2. **Estados Visuales** → Verde/Amarillo
3. **Recordatorios** → A los pendientes
4. **Cierre** → Todos completos

### 🛍️ Gestión de Pedidos

#### Recepción de Pedido
1. **Cliente Solicita** → Producto específico
2. **Verificar Stock** → Sistema alerta disponibilidad
3. **Crear Pedido** → Alumno, producto, talla, precio
4. **Confirmar** → Estado "Pedido"

#### Seguimiento
1. **Mercadería Llega** → Cambiar a "Recibido"
2. **Stock se Descuenta** → Automático
3. **Avisar Cliente** → Producto disponible
4. **Entrega** → Cambiar a "Entregado"

---

## 💡 Consejos y Trucos

### 📱 Optimización Mobile
- **Botones Grandes** → Fácil uso en celular
- **Scroll Horizontal** → En tablas largas
- **Modals Fullscreen** → En pantallas pequeñas
- **Touch Friendly** → Diseñado para dedos

### ⚡ Atajos Rápidos
- **Doble Click** → Editar precios en stock
- **Toggle Switch** → Asistencia rápida
- **Filtros** → Encontrar información específica
- **Búsqueda** → En listas largas

### 💾 Gestión de Datos
- **Guardado Automático** → Cada cambio se guarda
- **Sin Pérdida** → Datos locales seguros
- **Sincronización** → Entre módulos automática
- **Backup** → Exportar datos (próximamente)

### 🎯 Mejores Prácticas
- **Actualizar Inmediatamente** → Pagos y asistencias
- **Revisar Semanalmente** → Estados y pendientes
- **Configurar Montos** → Según necesidades
- **Usar Filtros** → Para información específica

---

## 🔧 Solución de Problemas

### ❓ Problemas Comunes

#### "No veo un alumno nuevo en Mensualidades"
**Solución**: El sistema sincroniza automáticamente. Si no aparece:
1. Refrescar la página (F5)
2. Verificar que el alumno se creó correctamente
3. Ir a Mensualidades → debería aparecer como "PENDIENTE"

#### "El stock no se actualiza"
**Solución**: El stock se descuenta al marcar pedido como "Recibido":
1. Pedido → No descuenta stock
2. Recibido → Descuenta stock automáticamente
3. Entregado → Solo cambia estado

#### "No puedo editar un precio"
**Solución**: 
1. Ir a Stock de Indumentaria
2. Click en el precio (aparece 📝)
3. Editar valor
4. Click ✓ para guardar

#### "La asistencia no se guarda"
**Solución**:
1. Verificar que seleccionaste el turno correcto
2. Toggle debe cambiar de color
3. Se guarda automáticamente al cambiar

### 🆘 Soporte Técnico

#### Navegador Recomendado
- **Chrome** (mejor rendimiento)
- **Firefox** (alternativa)
- **Safari** (iOS/Mac)
- **Edge** (Windows)

#### Requisitos Mínimos
- **Internet** → Solo para cargar inicial
- **Navegador Actualizado** → Última versión
- **JavaScript Habilitado** → Por defecto
- **Cookies Permitidas** → Para guardar datos

#### Contacto
- **Sistema Funcionando**: https://krav-maga-sys.netlify.app
- **Soporte**: Disponible para consultas
- **Actualizaciones**: Automáticas sin downtime

---

## 📈 Próximas Funcionalidades

### 🔜 En Desarrollo
- **📊 Reportes Avanzados** → Estadísticas detalladas
- **📱 App Móvil Nativa** → iOS/Android
- **☁️ Backup en la Nube** → Seguridad adicional
- **👥 Multi-usuario** → Varios instructores
- **📧 Notificaciones** → Email/SMS automáticos

### 💡 Sugerencias
¿Tienes ideas para mejorar el sistema? ¡Compártelas!

---

## ✅ Checklist de Implementación

### Primera Semana
- [ ] Acceder al sistema
- [ ] Cargar alumnos existentes
- [ ] Configurar montos
- [ ] Probar asistencias
- [ ] Revisar temario

### Segunda Semana
- [ ] Gestionar mensualidades
- [ ] Crear pedidos de prueba
- [ ] Configurar stock
- [ ] Planificar renovaciones
- [ ] Entrenar al equipo

### Uso Diario
- [ ] Tomar asistencia
- [ ] Registrar clases
- [ ] Actualizar pagos
- [ ] Revisar pendientes
- [ ] Gestionar pedidos

---

**🥋 Sistema desarrollado específicamente para la gestión integral de clubes de Krav Maga. Profesional, completo y fácil de usar.**

*Versión 1.0 - Enero 2024*