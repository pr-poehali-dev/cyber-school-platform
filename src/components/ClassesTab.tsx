import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { storage, generateId, Class, Teacher, Student } from '@/lib/storage';
import { toast } from 'sonner';

export default function ClassesTab() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  
  const [newClass, setNewClass] = useState({ name: '', teacherId: '' });
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '', subject: '' });
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '', classId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setClasses(storage.classes.getAll());
    setTeachers(storage.teachers.getAll());
    setStudents(storage.students.getAll());
  };

  const handleAddClass = () => {
    if (!newClass.name || !newClass.teacherId) {
      toast.error('Заполните все поля');
      return;
    }

    const classData: Class = {
      id: generateId(),
      name: newClass.name,
      teacherId: newClass.teacherId,
      studentIds: [],
    };

    storage.classes.add(classData);
    setNewClass({ name: '', teacherId: '' });
    setIsAddClassOpen(false);
    loadData();
    toast.success('Класс успешно создан');
  };

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.password || !newTeacher.subject) {
      toast.error('Заполните все поля');
      return;
    }

    const teacher: Teacher = {
      id: generateId(),
      name: newTeacher.name,
      email: newTeacher.email,
      password: newTeacher.password,
      subject: newTeacher.subject,
    };

    storage.teachers.add(teacher);
    setNewTeacher({ name: '', email: '', password: '', subject: '' });
    setIsAddTeacherOpen(false);
    loadData();
    toast.success('Преподаватель добавлен');
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.password || !newStudent.classId) {
      toast.error('Заполните все поля');
      return;
    }

    const student: Student = {
      id: generateId(),
      name: newStudent.name,
      email: newStudent.email,
      password: newStudent.password,
      classId: newStudent.classId,
      parentIds: [],
    };

    storage.students.add(student);
    
    const classToUpdate = classes.find(c => c.id === newStudent.classId);
    if (classToUpdate) {
      storage.classes.update(classToUpdate.id, {
        studentIds: [...classToUpdate.studentIds, student.id]
      });
    }

    setNewStudent({ name: '', email: '', password: '', classId: '' });
    setIsAddStudentOpen(false);
    loadData();
    toast.success('Ученик добавлен');
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.name || 'Не назначен';
  };

  const getClassStudents = (classId: string) => {
    return students.filter(s => s.classId === classId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление классами</h2>
          <p className="text-muted-foreground">Добавляйте классы, учеников и преподавателей</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Добавить преподавателя
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый преподаватель</DialogTitle>
                <DialogDescription>Добавьте преподавателя в систему</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teacher-name">ФИО</Label>
                  <Input
                    id="teacher-name"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                <div>
                  <Label htmlFor="teacher-email">Email</Label>
                  <Input
                    id="teacher-email"
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    placeholder="teacher@cyberschool.ru"
                  />
                </div>
                <div>
                  <Label htmlFor="teacher-password">Пароль</Label>
                  <Input
                    id="teacher-password"
                    type="password"
                    value={newTeacher.password}
                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <Label htmlFor="teacher-subject">Предмет</Label>
                  <Input
                    id="teacher-subject"
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                    placeholder="Математика"
                  />
                </div>
                <Button onClick={handleAddTeacher} className="w-full">Добавить</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать класс
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый класс</DialogTitle>
                <DialogDescription>Создайте новый класс</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="class-name">Название класса</Label>
                  <Input
                    id="class-name"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    placeholder="10-А"
                  />
                </div>
                <div>
                  <Label htmlFor="class-teacher">Классный руководитель</Label>
                  <Select value={newClass.teacherId} onValueChange={(value) => setNewClass({ ...newClass, teacherId: value })}>
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
                <Button onClick={handleAddClass} className="w-full" disabled={teachers.length === 0}>
                  {teachers.length === 0 ? 'Сначала добавьте преподавателя' : 'Создать'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Icon name="Users" size={64} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">Нет классов</h3>
            <p className="text-muted-foreground mb-4">Создайте первый класс для начала работы</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.map(classItem => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{classItem.name}</CardTitle>
                    <CardDescription>
                      Руководитель: {getTeacherName(classItem.teacherId)}
                    </CardDescription>
                  </div>
                  <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setNewStudent({ ...newStudent, classId: classItem.id })}>
                        <Icon name="UserPlus" size={14} className="mr-1" />
                        Добавить ученика
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новый ученик</DialogTitle>
                        <DialogDescription>Добавьте ученика в класс {classItem.name}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="student-name">ФИО</Label>
                          <Input
                            id="student-name"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                            placeholder="Петров Петр Петрович"
                          />
                        </div>
                        <div>
                          <Label htmlFor="student-email">Email</Label>
                          <Input
                            id="student-email"
                            type="email"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                            placeholder="student@cyberschool.ru"
                          />
                        </div>
                        <div>
                          <Label htmlFor="student-password">Пароль</Label>
                          <Input
                            id="student-password"
                            type="password"
                            value={newStudent.password}
                            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                            placeholder="••••••••"
                          />
                        </div>
                        <Button onClick={handleAddStudent} className="w-full">Добавить</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Users" size={16} />
                    <span>{getClassStudents(classItem.id).length} учеников</span>
                  </div>
                  
                  {getClassStudents(classItem.id).length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Список учеников:</p>
                      <div className="space-y-1">
                        {getClassStudents(classItem.id).map(student => (
                          <div key={student.id} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                            <Icon name="User" size={14} className="text-muted-foreground" />
                            <span>{student.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}