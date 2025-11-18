import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { storage, generateId, Schedule, Class, Teacher } from '@/lib/storage';
import { toast } from 'sonner';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export default function ScheduleTab() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  
  const [newSchedule, setNewSchedule] = useState({
    classId: '',
    teacherId: '',
    subject: '',
    dayOfWeek: '0',
    startTime: '',
    endTime: '',
    room: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSchedules(storage.schedules.getAll());
    setClasses(storage.classes.getAll());
    setTeachers(storage.teachers.getAll());
  };

  const handleAddSchedule = () => {
    if (!newSchedule.classId || !newSchedule.teacherId || !newSchedule.subject || 
        !newSchedule.startTime || !newSchedule.endTime || !newSchedule.room) {
      toast.error('Заполните все поля');
      return;
    }

    const schedule: Schedule = {
      id: generateId(),
      classId: newSchedule.classId,
      teacherId: newSchedule.teacherId,
      subject: newSchedule.subject,
      dayOfWeek: parseInt(newSchedule.dayOfWeek),
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      room: newSchedule.room,
    };

    storage.schedules.add(schedule);
    setNewSchedule({
      classId: '',
      teacherId: '',
      subject: '',
      dayOfWeek: '0',
      startTime: '',
      endTime: '',
      room: '',
    });
    setIsAddScheduleOpen(false);
    loadData();
    toast.success('Урок добавлен в расписание');
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Неизвестно';
  };

  const getTeacherName = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId)?.name || 'Неизвестно';
  };

  const getScheduleByDay = (dayIndex: number) => {
    return schedules
      .filter(s => s.dayOfWeek === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Расписание уроков</h2>
          <p className="text-muted-foreground">Управляйте расписанием классов</p>
        </div>
        <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить урок
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Новый урок</DialogTitle>
              <DialogDescription>Добавьте урок в расписание</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="schedule-class">Класс</Label>
                <Select value={newSchedule.classId} onValueChange={(value) => setNewSchedule({ ...newSchedule, classId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите класс" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schedule-teacher">Преподаватель</Label>
                <Select value={newSchedule.teacherId} onValueChange={(value) => setNewSchedule({ ...newSchedule, teacherId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите преподавателя" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.subject})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schedule-subject">Предмет</Label>
                <Input
                  id="schedule-subject"
                  value={newSchedule.subject}
                  onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                  placeholder="Математика"
                />
              </div>
              <div>
                <Label htmlFor="schedule-day">День недели</Label>
                <Select value={newSchedule.dayOfWeek} onValueChange={(value) => setNewSchedule({ ...newSchedule, dayOfWeek: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите день" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-start">Начало</Label>
                  <Input
                    id="schedule-start"
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="schedule-end">Конец</Label>
                  <Input
                    id="schedule-end"
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="schedule-room">Кабинет</Label>
                <Input
                  id="schedule-room"
                  value={newSchedule.room}
                  onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                  placeholder="Каб. 101"
                />
              </div>
              <Button onClick={handleAddSchedule} className="w-full" disabled={classes.length === 0 || teachers.length === 0}>
                {classes.length === 0 || teachers.length === 0 ? 'Создайте классы и добавьте преподавателей' : 'Добавить'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Icon name="Calendar" size={64} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">Расписание пусто</h3>
            <p className="text-muted-foreground mb-4">Добавьте первый урок в расписание</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DAYS.map((day, index) => {
            const daySchedule = getScheduleByDay(index);
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Calendar" size={18} className="text-primary" />
                    {day}
                  </CardTitle>
                  <CardDescription>{daySchedule.length} уроков</CardDescription>
                </CardHeader>
                <CardContent>
                  {daySchedule.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Нет уроков</p>
                  ) : (
                    <div className="space-y-3">
                      {daySchedule.map(schedule => (
                        <div key={schedule.id} className="p-3 rounded-lg bg-muted/50 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{schedule.subject}</span>
                            <span className="text-xs text-muted-foreground">{schedule.room}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getClassName(schedule.classId)} • {getTeacherName(schedule.teacherId)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Clock" size={12} />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
