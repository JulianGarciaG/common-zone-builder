import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { CommonAreaData, ValidationErrors } from '@/hooks/useFormValidation';

interface ScheduleSectionProps {
  schedule: CommonAreaData['schedule'];
  errors: ValidationErrors;
  onScheduleUpdate: (day: string, sessionIndex: number, field: 'openTime' | 'closeTime', value: string) => void;
  onAddSession: (day: string) => void;
  onRemoveSession: (day: string, sessionIndex: number) => void;
}

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  schedule,
  errors,
  onScheduleUpdate,
  onAddSession,
  onRemoveSession,
}) => {
  return (
    <Card className="shadow-card">
      <CardHeader className="bg-gradient-admin border-b">
        <CardTitle className="flex items-center gap-2 text-admin-primary">
          <Clock className="h-5 w-5" />
          Horarios de Funcionamiento
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">{label}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSession(key)}
                  className="flex items-center gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Agregar jornada
                </Button>
              </div>
              
              {schedule[key].map((session, sessionIndex) => (
                <div key={sessionIndex} className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Jornada {sessionIndex + 1}
                    </Label>
                    {schedule[key].length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveSession(key, sessionIndex)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Hora de apertura</Label>
                      <Input
                        type="time"
                        value={session.openTime}
                        onChange={(e) => onScheduleUpdate(key, sessionIndex, 'openTime', e.target.value)}
                        className={`transition-all duration-200 ${
                          errors[`${key}.${sessionIndex}.openTime`] 
                            ? 'border-destructive focus:border-destructive ring-destructive/20' 
                            : 'focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                      {errors[`${key}.${sessionIndex}.openTime`] && (
                        <p className="text-sm text-destructive animate-slide-in">
                          {errors[`${key}.${sessionIndex}.openTime`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Hora de cierre</Label>
                      <Input
                        type="time"
                        value={session.closeTime}
                        onChange={(e) => onScheduleUpdate(key, sessionIndex, 'closeTime', e.target.value)}
                        className={`transition-all duration-200 ${
                          errors[`${key}.${sessionIndex}.closeTime`] 
                            ? 'border-destructive focus:border-destructive ring-destructive/20' 
                            : 'focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                      {errors[`${key}.${sessionIndex}.closeTime`] && (
                        <p className="text-sm text-destructive animate-slide-in">
                          {errors[`${key}.${sessionIndex}.closeTime`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};