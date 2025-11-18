import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { storage, generateId, Assignment, Class, Teacher } from '@/lib/storage';
import { toast } from 'sonner';

export default function AssignmentsTab() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  
  const [newAssignment, setNewAssignment] = useState({
    classId: '',
    teacherId: '',
    subject: '',
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAssignments(storage.assignments.getAll());
    setClasses(storage.classes.getAll());
    setTeachers(storage.teachers.getAll());
  };

  const handleAddAssignment = () => {
    if (!newAssignment.classId || !newAssignment.teacherId || !newAssignment.subject || 
        !newAssignment.title || !newAssignment.description || !newAssignment.dueDate) {
      toast.error('Заполните все поля');
      return;
    }

    const assignment: Assignment = {
      id: generateId(),
      classId: newAssignment.classId,
      teacherId: newAssignment.teacherId,
      subject: newAssignment.subject,
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
    };

    storage.assignments.add(assignment);
    setNewAssignment({
      classId: '',
      teacherId: '',
      subject: '',
      title: '',
      description: '',
      dueDate: '',
    });
    setIsAddAssignmentOpen(false);
    loadData();
    toast.success('Задание создано');
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Неизвестно';
  };

  const getTeacherName = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId)?.name || 'Неизвестно';
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Домашние задания</h2>
          <p className="text-muted-foreground">Создавайте и управляйте заданиями для классов</p>
        </div>
        <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать задание
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Новое задание</DialogTitle>
              <DialogDescription>Создайте домашнее задание для класса</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="assignment-class">Класс</Label>
                <Select value={newAssignment.classId} onValueChange={(value) => setNewAssignment({ ...newAssignment, classId: value })}>
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
                <Label htmlFor="assignment-teacher">Преподаватель</Label>
                <Select value={newAssignment.teacherId} onValueChange={(value) => setNewAssignment({ ...newAssignment, teacherId: value })}>
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
                <Label htmlFor="assignment-subject">Предмет</Label>
                <Input
                  id="assignment-subject"
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                  placeholder="Математика"
                />
              </div>
              <div>
                <Label htmlFor="assignment-title">Название задания</Label>
                <Input
                  id="assignment-title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Решить задачи 1-10"
                />
              </div>
              <div>
                <Label htmlFor="assignment-description">Описание</Label>
                <Textarea
                  id="assignment-description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Подробное описание задания..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="assignment-due">Срок сдачи</Label>
                <Input
                  id="assignment-due"
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>
              <Button onClick={handleAddAssignment} className="w-full" disabled={classes.length === 0 || teachers.length === 0}>
                {classes.length === 0 || teachers.length === 0 ? 'Создайте классы и добавьте преподавателей' : 'Создать задание'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Icon name="BookOpen" size={64} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">Нет заданий</h3>
            <p className="text-muted-foreground mb-4">Создайте первое домашнее задание</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignments.map(assignment => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Icon name="Users" size={12} className="mr-1" />
                        {getClassName(assignment.classId)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Icon name="BookOpen" size={12} className="mr-1" />
                        {assignment.subject}
                      </Badge>
                      <Badge variant={isOverdue(assignment.dueDate) ? "destructive" : "secondary"} className="text-xs">
                        <Icon name="Clock" size={12} className="mr-1" />
                        {formatDate(assignment.dueDate)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {assignment.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <Icon name="User" size={14} />
                  <span>{getTeacherName(assignment.teacherId)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
