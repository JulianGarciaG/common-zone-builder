import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Plus, Trash2, AlertCircle } from 'lucide-react';

const daysOfWeek = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
];

export const ScheduleSection = ({ schedule, errors = {}, onScheduleUpdate }) => {
  const addSession = (day) => {
    const currentSessions = schedule[day] || [];
    const newSessions = [...currentSessions, { startTime: '', endTime: '' }];
    onScheduleUpdate(day, newSessions);
  };

  const removeSession = (day, sessionIndex) => {
    const currentSessions = schedule[day] || [];
    if (currentSessions.length > 1) {
      const newSessions = currentSessions.filter((_, index) => index !== sessionIndex);
      onScheduleUpdate(day, newSessions);
    }
  };

  const updateSession = (day, sessionIndex, field, value) => {
    const currentSessions = [...(schedule[day] || [])];
    if (currentSessions[sessionIndex]) {
      currentSessions[sessionIndex] = {
        ...currentSessions[sessionIndex],
        [field]: value
      };
      onScheduleUpdate(day, currentSessions);
    }
  };

  const getFieldError = (day, sessionIndex, field) => {
    return errors?.[day]?.[sessionIndex]?.[field];
  };
  return (
    <Card className="shadow-card">
      <CardHeader className="bg-gradient-admin border-b">
        <CardTitle className="flex items-center gap-2 text-admin-primary">
          <Clock className="h-5 w-5" />
          Horarios de Disponibilidad
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {daysOfWeek.map(({ key, label }) => {
          const daySessions = schedule[key] || [];
          
          return (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">
                  {label}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSession(key)}
                  className="flex items-center gap-1 text-xs hover:bg-admin-light hover:border-admin-primary transition-all duration-200"
                >
                  <Plus className="h-3 w-3" />
                  Agregar jornada
                </Button>
              </div>
              
              <div className="space-y-3">
                {daySessions.map((session, sessionIndex) => (
                  <div key={sessionIndex} className="flex items-center gap-3 p-3 bg-admin-light rounded-lg border border-admin-primary/20">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Hora de apertura
                        </Label>
                        <Input
                          type="time"
                          value={session.startTime}
                          onChange={(e) => updateSession(key, sessionIndex, 'startTime', e.target.value)}
                          className={`h-8 text-sm transition-all duration-200 ${
                            getFieldError(key, sessionIndex, 'startTime')
                              ? 'border-destructive focus:border-destructive ring-destructive/20' 
                              : 'focus:border-primary focus:ring-primary/20'
                          }`}
                        />
                        {getFieldError(key, sessionIndex, 'startTime') && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-2 w-2" />
                            {getFieldError(key, sessionIndex, 'startTime')}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Hora de cierre
                        </Label>
                        <Input
                          type="time"
                          value={session.endTime}
                          onChange={(e) => updateSession(key, sessionIndex, 'endTime', e.target.value)}
                          className={`h-8 text-sm transition-all duration-200 ${
                            getFieldError(key, sessionIndex, 'endTime')
                              ? 'border-destructive focus:border-destructive ring-destructive/20' 
                              : 'focus:border-primary focus:ring-primary/20'
                          }`}
                        />
                        {getFieldError(key, sessionIndex, 'endTime') && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-2 w-2" />
                            {getFieldError(key, sessionIndex, 'endTime')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {daySessions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSession(key, sessionIndex)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};