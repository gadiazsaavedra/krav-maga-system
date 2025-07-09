---
title: "Manual de Usuario - Sistema Krav Maga"
author: "Sistema de Gestión Krav Maga"
date: "Enero 2024"
geometry: margin=2cm
fontsize: 11pt
documentclass: article
header-includes:
  - \usepackage{fancyhdr}
  - \pagestyle{fancy}
  - \fancyhead[L]{Sistema Krav Maga}
  - \fancyhead[R]{Manual de Usuario}
  - \usepackage{xcolor}
  - \definecolor{primary}{RGB}{25,118,210}
---

\newpage
\tableofcontents
\newpage

# 🥋 Manual de Usuario - Sistema Krav Maga

## Información del Sistema
- **URL**: https://krav-maga-sys.netlify.app
- **Versión**: 1.0
- **Fecha**: Enero 2024
- **Compatibilidad**: Todos los navegadores y dispositivos

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
El panel principal está diseñado para el flujo de trabajo diario de un instructor.

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
- **➕ Crear Alumnos** - Formulario completo
- **✏️ Editar Información** - Modificar datos existentes
- **🔍 Buscar Alumnos** - Filtro por nombre
- **📋 Lista Completa** - Todos los alumnos registrados

#### Cómo Usar
1. **Nuevo Alumno**: Panel Principal → "Nuevo Alumno"
2. **Completar Datos**: Nombre, apellido, teléfono, cinturón inicial
3. **Guardar**: Se registra automáticamente
4. **Aparece Automáticamente**: En renovaciones y mensualidades

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

---

### 🥋 5. Exámenes de Cinturón

#### Gestión de Exámenes
- **📋 Historial Completo** - Exámenes pasados
- **📅 Próximos Exámenes** - Candidatos seleccionados
- **✅ Control de Requisitos** - Formulario y pago
- **🏆 Resultados** - Aprobado/No Aprobado/Pendiente

#### Montos por Cinturón
- 🤍 **Blanco** → $8.000
- 🟡 **Amarillo** → $9.000
- 🟠 **Naranja** → $10.000
- 🟢 **Verde** → $11.000
- 🔵 **Azul** → $12.000
- 🟤 **Marrón** → $13.000
- ⚫ **Negro** → $15.000

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

---

## 🆘 Soporte Técnico

### Navegador Recomendado
- **Chrome** (mejor rendimiento)
- **Firefox** (alternativa)
- **Safari** (iOS/Mac)
- **Edge** (Windows)

### Requisitos Mínimos
- **Internet** → Solo para cargar inicial
- **Navegador Actualizado** → Última versión
- **JavaScript Habilitado** → Por defecto
- **Cookies Permitidas** → Para guardar datos

### Contacto
- **Sistema Funcionando**: https://krav-maga-sys.netlify.app
- **Soporte**: Disponible para consultas
- **Actualizaciones**: Automáticas sin downtime

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

**🥋 Sistema desarrollado específicamente para la gestión integral de clubes de Krav Maga.**

**Profesional, completo y fácil de usar.**

*Manual de Usuario - Versión 1.0 - Enero 2024*