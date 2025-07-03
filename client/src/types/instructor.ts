// Tipos para el módulo de instructor
export interface TemaCurriculum {
  id: number;
  titulo: string;
  descripcion?: string;
  orden: number;
  cinturon: string;
}

export interface ProgresoGrupo {
  id: number;
  turno_id: number;
  ultimo_tema_id: number;
  fecha_ultima_clase: string;
  tipo_ultima_clase: 'nuevo' | 'repaso';
}

export interface Recordatorio {
  id: number;
  titulo: string;
  contenido: string;
  fecha_activacion: string;
  momento: 'inicio' | 'final';
  activo: boolean;
  turno_id?: number; // null = para todos los turnos
}

export interface SesionClase {
  id: number;
  turno_id: number;
  fecha: string;
  tema_id: number;
  tipo: 'nuevo' | 'repaso';
  instructor_notas?: string;
}