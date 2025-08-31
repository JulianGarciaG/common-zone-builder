import { useState, useCallback } from 'react';

export interface CommonAreaData {
  name: string;
  capacity: number | '';
  uniqueReservation: boolean | '';
  reservationDuration: number | '';
  durationUnit: 'minutes' | 'hours';
  status: 'available' | 'reserved' | 'maintenance' | '';
  cost: number | '';
  recommendations: string;
  schedule: {
    [key: string]: {
      session1: {
        openTime: string;
        closeTime: string;
      };
      session2: {
        openTime: string;
        closeTime: string;
      };
    };
  };
}

export interface ValidationErrors {
  [key: string]: string;
}

const initialData: CommonAreaData = {
  name: '',
  capacity: '',
  uniqueReservation: '',
  reservationDuration: '',
  durationUnit: 'hours',
  status: '',
  cost: '',
  recommendations: '',
  schedule: {
    monday: { session1: { openTime: '', closeTime: '' }, session2: { openTime: '', closeTime: '' } },
    tuesday: { session1: { openTime: '', closeTime: '' }, session2: { openTime: '', closeTime: '' } },
    wednesday: { session1: { openTime: '', closeTime: '' }, session2: { openTime: '', closeTime: '' } },
    thursday: { session1: { openTime: '', closeTime: '' }, session2: { openTime: '', closeTime: '' } },
    friday: { session1: { openTime: '', closeTime: '' }, session2: { openTime: '', closeTime: '' } },
    saturday: { session1: { openTime: '', closeTime: '' }, session2: { openTime: '', closeTime: '' } },
    sunday: { session1: { openTime: '', closeTime: '' }, session2: { openTime: '', closeTime: '' } },
  },
};

export const useFormValidation = () => {
  const [data, setData] = useState<CommonAreaData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateField = useCallback((name: string, value: any): string => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'El nombre de la zona es obligatorio' : '';
      
      case 'capacity':
        if (!value || value === '') return 'El aforo es obligatorio';
        if (Number(value) <= 0) return 'El aforo debe ser mayor a 0';
        return '';
      
      case 'uniqueReservation':
        return value === '' ? 'Debe seleccionar si permite reserva única' : '';
      
      case 'reservationDuration':
        if (!value || value === '') return 'La duración de la reserva es obligatoria';
        if (Number(value) <= 0) return 'La duración debe ser mayor a 0';
        return '';
      
      case 'status':
        return value === '' ? 'Debe seleccionar el estado de la zona' : '';
      
      case 'cost':
        if (value === '') return 'El costo de la reserva es obligatorio';
        if (Number(value) < 0) return 'El costo debe ser mayor o igual a 0';
        return '';
      
      default:
        return '';
    }
  }, []);

  const validateSchedule = useCallback((schedule: CommonAreaData['schedule']): ValidationErrors => {
    const scheduleErrors: ValidationErrors = {};
    
    Object.entries(schedule).forEach(([day, sessions]) => {
      // Validar que si hay una hora de apertura, también haya una de cierre
      if (sessions.session1.openTime && !sessions.session1.closeTime) {
        scheduleErrors[`${day}.session1.closeTime`] = 'La hora de cierre es obligatoria';
      }
      if (sessions.session1.closeTime && !sessions.session1.openTime) {
        scheduleErrors[`${day}.session1.openTime`] = 'La hora de apertura es obligatoria';
      }
      if (sessions.session2.openTime && !sessions.session2.closeTime) {
        scheduleErrors[`${day}.session2.closeTime`] = 'La hora de cierre es obligatoria';
      }
      if (sessions.session2.closeTime && !sessions.session2.openTime) {
        scheduleErrors[`${day}.session2.openTime`] = 'La hora de apertura es obligatoria';
      }

      // Validar que la hora de apertura sea menor a la de cierre
      if (sessions.session1.openTime && sessions.session1.closeTime) {
        const openMinutes = timeToMinutes(sessions.session1.openTime);
        const closeMinutes = timeToMinutes(sessions.session1.closeTime);
        if (openMinutes >= closeMinutes) {
          scheduleErrors[`${day}.session1.closeTime`] = 'La hora de cierre debe ser posterior a la de apertura';
        }
      }

      if (sessions.session2.openTime && sessions.session2.closeTime) {
        const openMinutes = timeToMinutes(sessions.session2.openTime);
        const closeMinutes = timeToMinutes(sessions.session2.closeTime);
        if (openMinutes >= closeMinutes) {
          scheduleErrors[`${day}.session2.closeTime`] = 'La hora de cierre debe ser posterior a la de apertura';
        }
      }

      // Validar que las dos jornadas no se solapen
      if (sessions.session1.openTime && sessions.session1.closeTime && 
          sessions.session2.openTime && sessions.session2.closeTime) {
        const session1Start = timeToMinutes(sessions.session1.openTime);
        const session1End = timeToMinutes(sessions.session1.closeTime);
        const session2Start = timeToMinutes(sessions.session2.openTime);
        const session2End = timeToMinutes(sessions.session2.closeTime);

        if ((session2Start < session1End && session2End > session1Start)) {
          scheduleErrors[`${day}.session2.openTime`] = 'Las jornadas no pueden solaparse';
        }
      }
    });

    return scheduleErrors;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validar campos principales
    Object.keys(data).forEach(key => {
      if (key !== 'schedule' && key !== 'recommendations') {
        const error = validateField(key, data[key as keyof CommonAreaData]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    // Validar horarios
    const scheduleErrors = validateSchedule(data.schedule);
    Object.assign(newErrors, scheduleErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data, validateField, validateSchedule]);

  const updateField = useCallback((name: string, value: any) => {
    setData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const updateSchedule = useCallback((day: string, session: 'session1' | 'session2', field: 'openTime' | 'closeTime', value: string) => {
    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [session]: {
            ...prev.schedule[day][session],
            [field]: value
          }
        }
      }
    }));

    // Limpiar errores relacionados
    const errorKey = `${day}.${session}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  }, [errors]);

  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const submitForm = useCallback(async (onSubmit?: (data: CommonAreaData) => Promise<void>) => {
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        if (onSubmit) {
          await onSubmit(data);
        }
        // Aquí podrías mostrar un toast de éxito
        console.log('Zona común guardada exitosamente:', data);
      } catch (error) {
        console.error('Error al guardar la zona común:', error);
        // Aquí podrías mostrar un toast de error
      }
    }
    
    setIsSubmitting(false);
  }, [data, validateForm]);

  return {
    data,
    errors,
    isSubmitting,
    updateField,
    updateSchedule,
    validateForm,
    resetForm,
    submitForm,
    validateField
  };
};