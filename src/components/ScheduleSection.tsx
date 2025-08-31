import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { CommonAreaData, ValidationErrors } from '@/hooks/useFormValidation';

interface ScheduleSectionProps {
  schedule: CommonAreaData['schedule'];
  errors: ValidationErrors;
  onScheduleUpdate: (day: string, session: 'session1' | 'session2', field: 'openTime' | 'closeTime', value: string) => void;
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
              <Label className="text-base font-semibold text-foreground">{label}</Label>
              
              {/* Jornada 1 */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Jornada 1</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Hora de apertura</Label>
                    <Input
                      type="time"
                      value={schedule[key].session1.openTime}
                      onChange={(e) => onScheduleUpdate(key, 'session1', 'openTime', e.target.value)}
                      className={`transition-all duration-200 ${
                        errors[`${key}.session1.openTime`] 
                          ? 'border-destructive focus:border-destructive ring-destructive/20' 
                          : 'focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    {errors[`${key}.session1.openTime`] && (
                      <p className="text-sm text-destructive animate-slide-in">
                        {errors[`${key}.session1.openTime`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Hora de cierre</Label>
                    <Input
                      type="time"
                      value={schedule[key].session1.closeTime}
                      onChange={(e) => onScheduleUpdate(key, 'session1', 'closeTime', e.target.value)}
                      className={`transition-all duration-200 ${
                        errors[`${key}.session1.closeTime`] 
                          ? 'border-destructive focus:border-destructive ring-destructive/20' 
                          : 'focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    {errors[`${key}.session1.closeTime`] && (
                      <p className="text-sm text-destructive animate-slide-in">
                        {errors[`${key}.session1.closeTime`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Jornada 2 */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Jornada 2</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Hora de apertura</Label>
                    <Input
                      type="time"
                      value={schedule[key].session2.openTime}
                      onChange={(e) => onScheduleUpdate(key, 'session2', 'openTime', e.target.value)}
                      className={`transition-all duration-200 ${
                        errors[`${key}.session2.openTime`] 
                          ? 'border-destructive focus:border-destructive ring-destructive/20' 
                          : 'focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    {errors[`${key}.session2.openTime`] && (
                      <p className="text-sm text-destructive animate-slide-in">
                        {errors[`${key}.session2.openTime`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Hora de cierre</Label>
                    <Input
                      type="time"
                      value={schedule[key].session2.closeTime}
                      onChange={(e) => onScheduleUpdate(key, 'session2', 'closeTime', e.target.value)}
                      className={`transition-all duration-200 ${
                        errors[`${key}.session2.closeTime`] 
                          ? 'border-destructive focus:border-destructive ring-destructive/20' 
                          : 'focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    {errors[`${key}.session2.closeTime`] && (
                      <p className="text-sm text-destructive animate-slide-in">
                        {errors[`${key}.session2.closeTime`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};