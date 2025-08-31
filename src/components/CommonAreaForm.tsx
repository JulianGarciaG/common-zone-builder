import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleSection } from './ScheduleSection';
import { useFormValidation } from '@/hooks/useFormValidation';
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

export const CommonAreaForm: React.FC = () => {
  const {
    data,
    errors,
    isSubmitting,
    updateField,
    updateSchedule,
    addSession,
    removeSession,
    resetForm,
    submitForm
  } = useFormValidation();
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await submitForm(async (formData) => {
      // Aquí iría la lógica para enviar los datos al backend
      toast({
        title: "Zona común guardada",
        description: "La zona común se ha guardado exitosamente",
      });
    });
  };

  const handleCancel = () => {
    resetForm();
    toast({
      title: "Formulario cancelado",
      description: "Se han limpiado todos los campos",
      variant: "destructive"
    });
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Ej: Piscina, Salón Social, Cancha de Fútbol"
                    value={data.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`transition-all duration-200 ${
                      errors.name 
                        ? 'border-destructive focus:border-destructive ring-destructive/20' 
                        : 'focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {errors.name && (
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
                    type="number"
                    min="1"
                    placeholder="Número de personas"
                    value={data.capacity}
                    onChange={(e) => updateField('capacity', e.target.value ? Number(e.target.value) : '')}
                    className={`transition-all duration-200 ${
                      errors.capacity 
                        ? 'border-destructive focus:border-destructive ring-destructive/20' 
                        : 'focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {errors.capacity && (
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
                    value={data.uniqueReservation === '' ? '' : data.uniqueReservation ? 'yes' : 'no'}
                    onValueChange={(value) => updateField('uniqueReservation', value === 'yes')}
                  >
                    <SelectTrigger className={`transition-all duration-200 ${
                      errors.uniqueReservation 
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
                  {errors.uniqueReservation && (
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
                    value={data.status}
                    onValueChange={(value) => updateField('status', value)}
                  >
                    <SelectTrigger className={`transition-all duration-200 ${
                      errors.status 
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
                  {errors.status && (
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
                      value={data.reservationDuration}
                      onChange={(e) => updateField('reservationDuration', e.target.value ? Number(e.target.value) : '')}
                      className={`flex-1 transition-all duration-200 ${
                        errors.reservationDuration 
                          ? 'border-destructive focus:border-destructive ring-destructive/20' 
                          : 'focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    <Select
                      value={data.durationUnit}
                      onValueChange={(value: 'minutes' | 'hours') => updateField('durationUnit', value)}
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
                  {errors.reservationDuration && (
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
                      value={data.cost}
                      onChange={(e) => updateField('cost', e.target.value ? Number(e.target.value) : '')}
                      className={`pl-10 transition-all duration-200 ${
                        errors.cost 
                          ? 'border-destructive focus:border-destructive ring-destructive/20' 
                          : 'focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                  </div>
                  {errors.cost && (
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
                  value={data.recommendations}
                  onChange={(e) => updateField('recommendations', e.target.value)}
                  className="min-h-20 transition-all duration-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Horarios */}
          <ScheduleSection
            schedule={data.schedule}
            errors={errors}
            onScheduleUpdate={updateSchedule}
            onAddSession={addSession}
            onRemoveSession={removeSession}
          />

          {/* Botones de Acción */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
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
        </form>
      </div>
    </div>
  );
};