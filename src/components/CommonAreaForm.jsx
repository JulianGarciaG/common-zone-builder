import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleSection } from './ScheduleSection';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  Clock, 
  DollarSign, 
  Settings, 
  FileText,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

const validationSchema = Yup.object({
  name: Yup.string().required('El nombre de la zona es obligatorio'),
  capacity: Yup.number()
    .required('El aforo es obligatorio')
    .min(1, 'El aforo debe ser mayor a 0'),
  uniqueReservation: Yup.boolean().required('Debe seleccionar una opción'),
  reservationDuration: Yup.number()
    .required('La duración es obligatoria')
    .min(1, 'La duración debe ser mayor a 0'),
  durationUnit: Yup.string().required('Debe seleccionar una unidad'),
  cost: Yup.number()
    .required('El costo es obligatorio')
    .min(0, 'El costo debe ser mayor o igual a 0'),
  status: Yup.string().required('Debe seleccionar un estado'),
  recommendations: Yup.string(),
  schedule: Yup.object().shape({
    monday: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().required('Hora de inicio requerida'),
        endTime: Yup.string().required('Hora de fin requerida')
      })
    ),
    tuesday: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().required('Hora de inicio requerida'),
        endTime: Yup.string().required('Hora de fin requerida')
      })
    ),
    wednesday: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().required('Hora de inicio requerida'),
        endTime: Yup.string().required('Hora de fin requerida')
      })
    ),
    thursday: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().required('Hora de inicio requerida'),
        endTime: Yup.string().required('Hora de fin requerida')
      })
    ),
    friday: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().required('Hora de inicio requerida'),
        endTime: Yup.string().required('Hora de fin requerida')
      })
    ),
    saturday: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().required('Hora de inicio requerida'),
        endTime: Yup.string().required('Hora de fin requerida')
      })
    ),
    sunday: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().required('Hora de inicio requerida'),
        endTime: Yup.string().required('Hora de fin requerida')
      })
    )
  })
});

const initialValues = {
  name: '',
  capacity: '',
  uniqueReservation: '',
  reservationDuration: '',
  durationUnit: 'hours',
  cost: '',
  status: '',
  recommendations: '',
  schedule: {
    monday: [{ startTime: '', endTime: '' }],
    tuesday: [{ startTime: '', endTime: '' }],
    wednesday: [{ startTime: '', endTime: '' }],
    thursday: [{ startTime: '', endTime: '' }],
    friday: [{ startTime: '', endTime: '' }],
    saturday: [{ startTime: '', endTime: '' }],
    sunday: [{ startTime: '', endTime: '' }]
  }
};

export const CommonAreaForm = () => {
  const { toast } = useToast();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Form data:', values);
      
      toast({
        title: "Zona común guardada",
        description: "La zona común se ha guardado exitosamente",
      });
      
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar la zona común",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const validateSchedule = (schedule) => {
    const errors = {};
    
    Object.entries(schedule).forEach(([day, sessions]) => {
      sessions.forEach((session, index) => {
        if (session.startTime && session.endTime) {
          if (session.startTime >= session.endTime) {
            if (!errors[day]) errors[day] = {};
            if (!errors[day][index]) errors[day][index] = {};
            errors[day][index].endTime = 'La hora de fin debe ser mayor a la de inicio';
          }
        }
      });
      
      // Verificar solapamientos entre sesiones
      for (let i = 0; i < sessions.length - 1; i++) {
        for (let j = i + 1; j < sessions.length; j++) {
          const session1 = sessions[i];
          const session2 = sessions[j];
          
          if (session1.startTime && session1.endTime && session2.startTime && session2.endTime) {
            const start1 = new Date(`2000-01-01T${session1.startTime}`);
            const end1 = new Date(`2000-01-01T${session1.endTime}`);
            const start2 = new Date(`2000-01-01T${session2.startTime}`);
            const end2 = new Date(`2000-01-01T${session2.endTime}`);
            
            if ((start1 < end2 && end1 > start2)) {
              if (!errors[day]) errors[day] = {};
              if (!errors[day][j]) errors[day][j] = {};
              errors[day][j].startTime = 'Las jornadas no pueden solaparse';
            }
          }
        }
      }
    });
    
    return Object.keys(errors).length > 0 ? { schedule: errors } : {};
  };

  return (
    <div className="min-h-screen bg-gradient-admin p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Zonas Comunes
          </h1>
          <p className="text-muted-foreground">
            Crea y modifica las zonas comunes del conjunto residencial
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validate={validateSchedule}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue, resetForm }) => (
            <Form className="space-y-6">
              {/* Información Básica */}
              <Card className="shadow-card">
                <CardHeader className="bg-gradient-admin border-b">
                  <CardTitle className="flex items-center gap-2 text-admin-primary">
                    <Building2 className="h-5 w-5" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Nombre de la zona *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Ej: Piscina, Salón Social, Cancha de Fútbol"
                        value={values.name}
                        onChange={(e) => setFieldValue('name', e.target.value)}
                        className={`transition-all duration-200 ${
                          errors.name && touched.name
                            ? 'border-destructive focus:border-destructive ring-destructive/20' 
                            : 'focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-slide-in">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-sm font-medium">
                        Aforo *
                      </Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        min="1"
                        placeholder="Número de personas"
                        value={values.capacity}
                        onChange={(e) => setFieldValue('capacity', e.target.value ? Number(e.target.value) : '')}
                        className={`transition-all duration-200 ${
                          errors.capacity && touched.capacity
                            ? 'border-destructive focus:border-destructive ring-destructive/20' 
                            : 'focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                      {errors.capacity && touched.capacity && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-slide-in">
                          <AlertCircle className="h-3 w-3" />
                          {errors.capacity}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Reserva única *
                      </Label>
                      <Select
                        value={values.uniqueReservation === '' ? '' : values.uniqueReservation ? 'yes' : 'no'}
                        onValueChange={(value) => setFieldValue('uniqueReservation', value === 'yes')}
                      >
                        <SelectTrigger className={`transition-all duration-200 ${
                          errors.uniqueReservation && touched.uniqueReservation
                            ? 'border-destructive focus:border-destructive ring-destructive/20' 
                            : 'focus:border-primary focus:ring-primary/20'
                        }`}>
                          <SelectValue placeholder="Seleccionar opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.uniqueReservation && touched.uniqueReservation && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-slide-in">
                          <AlertCircle className="h-3 w-3" />
                          {errors.uniqueReservation}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Estado de la zona *
                      </Label>
                      <Select
                        value={values.status}
                        onValueChange={(value) => setFieldValue('status', value)}
                      >
                        <SelectTrigger className={`transition-all duration-200 ${
                          errors.status && touched.status
                            ? 'border-destructive focus:border-destructive ring-destructive/20' 
                            : 'focus:border-primary focus:ring-primary/20'
                        }`}>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="reserved">Reservada</SelectItem>
                          <SelectItem value="maintenance">Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && touched.status && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-slide-in">
                          <AlertCircle className="h-3 w-3" />
                          {errors.status}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuración de Reservas */}
              <Card className="shadow-card">
                <CardHeader className="bg-gradient-admin border-b">
                  <CardTitle className="flex items-center gap-2 text-admin-primary">
                    <Settings className="h-5 w-5" />
                    Configuración de Reservas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Duración de la reserva *
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          placeholder="Cantidad"
                          value={values.reservationDuration}
                          onChange={(e) => setFieldValue('reservationDuration', e.target.value ? Number(e.target.value) : '')}
                          className={`flex-1 transition-all duration-200 ${
                            errors.reservationDuration && touched.reservationDuration
                              ? 'border-destructive focus:border-destructive ring-destructive/20' 
                              : 'focus:border-primary focus:ring-primary/20'
                          }`}
                        />
                        <Select
                          value={values.durationUnit}
                          onValueChange={(value) => setFieldValue('durationUnit', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutos</SelectItem>
                            <SelectItem value="hours">Horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.reservationDuration && touched.reservationDuration && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-slide-in">
                          <AlertCircle className="h-3 w-3" />
                          {errors.reservationDuration}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cost" className="text-sm font-medium">
                        Costo de la reserva *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={values.cost}
                          onChange={(e) => setFieldValue('cost', e.target.value ? Number(e.target.value) : '')}
                          className={`pl-10 transition-all duration-200 ${
                            errors.cost && touched.cost
                              ? 'border-destructive focus:border-destructive ring-destructive/20' 
                              : 'focus:border-primary focus:ring-primary/20'
                          }`}
                        />
                      </div>
                      {errors.cost && touched.cost && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-slide-in">
                          <AlertCircle className="h-3 w-3" />
                          {errors.cost}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendations" className="text-sm font-medium">
                      Recomendaciones
                    </Label>
                    <Textarea
                      id="recommendations"
                      placeholder="Instrucciones especiales, reglas de uso, etc."
                      value={values.recommendations}
                      onChange={(e) => setFieldValue('recommendations', e.target.value)}
                      className="min-h-20 transition-all duration-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Horarios */}
              <ScheduleSection
                schedule={values.schedule}
                errors={errors.schedule}
                onScheduleUpdate={(day, sessions) => setFieldValue(`schedule.${day}`, sessions)}
              />

              {/* Botones de Acción */}
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        toast({
                          title: "Formulario cancelado",
                          description: "Se han limpiado todos los campos",
                          variant: "destructive"
                        });
                      }}
                      className="flex items-center gap-2 transition-all duration-200 hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-hover transition-all duration-200"
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting ? 'Guardando...' : 'Guardar Zona'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};