import React, { useState } from 'react';
import { TextField } from '@mui/material';
import FormularioProgresivo from './FormularioProgresivo';
import AutocompleteField from './AutocompleteField';
import CinturonSelector from './CinturonSelector';
import FechaSelector from './FechaSelector';
import { formatTelefono, getSugerenciasEmail } from '../utils/formatters';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AlumnoFormProgresivoProps {
  onGuardar: (alumno: any) => void;
  onCancelar: () => void;
  alumnoInicial?: any;
}

const AlumnoFormProgresivo: React.FC<AlumnoFormProgresivoProps> = ({
  onGuardar,
  onCancelar,
  alumnoInicial
}) => {
  const [alumnosLocal] = useLocalStorage<any[]>('alumnos-krav-maga', []);
  const [valores, setValores] = useState(alumnoInicial || {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    cinturon: 'Blanco',
    fecha_nacimiento: '',
    fecha_registro: new Date().toISOString().split('T')[0]
  });

  // Sugerencias para autocompletado
  const nombresExistentes = Array.from(new Set(alumnosLocal.map((a: any) => a.nombre))).filter(Boolean);
  const apellidosExistentes = Array.from(new Set(alumnosLocal.map((a: any) => a.apellido))).filter(Boolean);

  const validarNombre = (valor: string) => {
    if (!valor || valor.length < 2) return 'Mínimo 2 caracteres';
    return null;
  };

  const validarTelefono = (valor: string) => {
    if (!valor) return 'Teléfono requerido';
    if (valor.replace(/\D/g, '').length < 8) return 'Teléfono inválido';
    return null;
  };

  const validarEmail = (valor: string) => {
    if (!valor) return 'Email requerido';
    if (!/\S+@\S+\.\S+/.test(valor)) return 'Email inválido';
    return null;
  };

  const validarFecha = (valor: string) => {
    if (!valor) return 'Fecha requerida';
    const fecha = new Date(valor);
    const hoy = new Date();
    if (fecha > hoy) return 'Fecha no puede ser futura';
    return null;
  };

  const campos = [
    {
      key: 'nombre',
      label: '¿Cuál es el nombre?',
      required: true,
      validator: validarNombre,
      component: (
        <AutocompleteField
          label="Nombre"
          value=""
          onChange={() => {}}
          suggestions={nombresExistentes}
        />
      )
    },
    {
      key: 'apellido',
      label: '¿Cuál es el apellido?',
      required: true,
      validator: validarNombre,
      component: (
        <AutocompleteField
          label="Apellido"
          value=""
          onChange={() => {}}
          suggestions={apellidosExistentes}
        />
      )
    },
    {
      key: 'telefono',
      label: '¿Cuál es el teléfono?',
      required: true,
      validator: validarTelefono,
      component: (
        <AutocompleteField
          label="Teléfono"
          value=""
          onChange={() => {}}
          suggestions={[]}
          type="tel"
          inputMode="tel"
          formatter={formatTelefono}
        />
      )
    },
    {
      key: 'email',
      label: '¿Cuál es el email?',
      required: true,
      validator: validarEmail,
      component: (
        <AutocompleteField
          label="Email"
          value=""
          onChange={() => {}}
          suggestions={getSugerenciasEmail(valores.email || '')}
          type="email"
          inputMode="email"
        />
      )
    },
    {
      key: 'cinturon',
      label: '¿Qué cinturón tiene?',
      required: true,
      component: (
        <CinturonSelector
          value=""
          onChange={() => {}}
        />
      )
    },
    {
      key: 'fecha_nacimiento',
      label: '¿Cuál es su fecha de nacimiento?',
      required: true,
      validator: validarFecha,
      component: (
        <FechaSelector
          label="Fecha de Nacimiento"
          value=""
          onChange={() => {}}
          max={new Date().toISOString().split('T')[0]}
        />
      )
    }
  ];

  const handleCambio = (key: string, value: any) => {
    setValores((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleGuardar = () => {
    // Limpiar datos temporales
    localStorage.removeItem('formulario-temp');
    onGuardar(valores);
  };

  return (
    <FormularioProgresivo
      campos={campos}
      valores={valores}
      onCambio={handleCambio}
      onGuardar={handleGuardar}
      onCancelar={onCancelar}
      titulo="Nuevo Alumno"
    />
  );
};

export default AlumnoFormProgresivo;