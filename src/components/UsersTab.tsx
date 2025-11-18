import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { storage, generateId, Teacher, Student, Parent } from '@/lib/storage';
import { toast } from 'sonner';

export default function UsersTab() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  
  const [newParent, setNewParent] = useState({
    name: '',
    email: '',
    password: '',
    studentIds: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTeachers(storage.teachers.getAll());
    setStudents(storage.students.getAll());
    setParents(storage.parents.getAll());
  };

  const handleAddParent = () => {
    if (!newParent.name || !newParent.email || !newParent.password) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const parent: Parent = {
      id: generateId(),
      name: newParent.name,
      email: newParent.email,
      password: newParent.password,
      studentIds: newParent.studentIds,
    };

    storage.parents.add(parent);
    setNewParent({ name: '', email: '', password: '', studentIds: [] });
    setIsAddParentOpen(false);
    loadData();
    toast.success('Родитель добавлен');
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Неизвестно';
  };

  const getClassName = (classId: string) => {
    const classes = storage.classes.getAll();
    return classes.find(c => c.id === classId)?.name || 'Не назначен';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Пользователи системы</h2>
          <p className="text-muted-foreground">Просмотр всех зарегистрированных пользователей</p>
        </div>
        <Dialog open={isAddParentOpen} onOpenChange={setIsAddParentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="UserPlus" size={16} className="mr-2" />
              Добавить родителя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый родитель</DialogTitle>
              <DialogDescription>Добавьте родителя в систему</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="parent-name">ФИО</Label>
                <Input
                  id="parent-name"
                  value={newParent.name}
                  onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                />
              </div>
              <div>
                <Label htmlFor="parent-email">Email</Label>
                <Input
                  id="parent-email"
                  type="email"
                  value={newParent.email}
                  onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                  placeholder="parent@cyberschool.ru"
                />
              </div>
              <div>
                <Label htmlFor="parent-password">Пароль</Label>
                <Input
                  id="parent-password"
                  type="password"
                  value={newParent.password}
                  onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <Button onClick={handleAddParent} className="w-full">Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="teachers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <Icon name="Briefcase" size={16} />
            Преподаватели ({teachers.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Icon name="Users" size={16} />
            Ученики ({students.length})
          </TabsTrigger>
          <TabsTrigger value="parents" className="flex items-center gap-2">
            <Icon name="UserCheck" size={16} />
            Родители ({parents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="mt-6">
          {teachers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Icon name="Briefcase" size={64} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Нет преподавателей</h3>
                <p className="text-muted-foreground">Добавьте преподавателей через раздел "Классы"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map(teacher => (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={24} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{teacher.name}</CardTitle>
                        <CardDescription className="text-xs truncate">{teacher.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">
                      <Icon name="BookOpen" size={12} className="mr-1" />
                      {teacher.subject}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          {students.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Icon name="Users" size={64} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Нет учеников</h3>
                <p className="text-muted-foreground">Добавьте учеников через раздел "Классы"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map(student => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={24} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{student.name}</CardTitle>
                        <CardDescription className="text-xs truncate">{student.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">
                      <Icon name="School" size={12} className="mr-1" />
                      {getClassName(student.classId)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="parents" className="mt-6">
          {parents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Icon name="UserCheck" size={64} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Нет родителей</h3>
                <p className="text-muted-foreground">Добавьте первого родителя</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parents.map(parent => (
                <Card key={parent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={24} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{parent.name}</CardTitle>
                        <CardDescription className="text-xs truncate">{parent.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {parent.studentIds.length > 0 ? (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground mb-2">Дети:</p>
                        {parent.studentIds.map(studentId => (
                          <Badge key={studentId} variant="outline" className="text-xs mr-1">
                            <Icon name="User" size={10} className="mr-1" />
                            {getStudentName(studentId)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Нет привязанных детей</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
