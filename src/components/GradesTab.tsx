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
import { storage, generateId, Grade, Student, Assignment, Teacher } from '@/lib/storage';
import { toast } from 'sonner';

export default function GradesTab() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  
  const [newGrade, setNewGrade] = useState({
    studentId: '',
    assignmentId: '',
    teacherId: '',
    value: '',
    note: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setGrades(storage.grades.getAll());
    setStudents(storage.students.getAll());
    setAssignments(storage.assignments.getAll());
    setTeachers(storage.teachers.getAll());
  };

  const handleAddGrade = () => {
    if (!newGrade.studentId || !newGrade.assignmentId || !newGrade.teacherId || !newGrade.value) {
      toast.error('Заполните обязательные поля');
      return;
    }

    const gradeValue = parseInt(newGrade.value);
    if (gradeValue < 1 || gradeValue > 5) {
      toast.error('Оценка должна быть от 1 до 5');
      return;
    }

    if (editingGrade) {
      storage.grades.update(editingGrade.id, {
        studentId: newGrade.studentId,
        assignmentId: newGrade.assignmentId,
        teacherId: newGrade.teacherId,
        value: gradeValue,
        note: newGrade.note,
      });
      toast.success('Оценка обновлена');
    } else {
      const grade: Grade = {
        id: generateId(),
        studentId: newGrade.studentId,
        assignmentId: newGrade.assignmentId,
        teacherId: newGrade.teacherId,
        value: gradeValue,
        note: newGrade.note,
        date: new Date().toISOString(),
      };
      storage.grades.add(grade);
      toast.success('Оценка выставлена');
    }

    setNewGrade({ studentId: '', assignmentId: '', teacherId: '', value: '', note: '' });
    setEditingGrade(null);
    setIsAddGradeOpen(false);
    loadData();
  };

  const handleDeleteGrade = (gradeId: string) => {
    storage.grades.delete(gradeId);
    loadData();
    toast.success('Оценка удалена');
  };

  const openEditDialog = (grade: Grade) => {
    setEditingGrade(grade);
    setNewGrade({
      studentId: grade.studentId,
      assignmentId: grade.assignmentId,
      teacherId: grade.teacherId,
      value: grade.value.toString(),
      note: grade.note || '',
    });
    setIsAddGradeOpen(true);
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Неизвестно';
  };

  const getAssignmentTitle = (assignmentId: string) => {
    return assignments.find(a => a.id === assignmentId)?.title || 'Неизвестно';
  };

  const getTeacherName = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId)?.name || 'Неизвестно';
  };

  const getGradeColor = (value: number) => {
    if (value >= 4) return 'bg-green-500';
    if (value === 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAverageGrade = () => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
    return (sum / grades.length).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Успеваемость</h2>
          <p className="text-muted-foreground">Управляйте оценками учеников</p>
        </div>
        <Dialog open={isAddGradeOpen} onOpenChange={(open) => {
          setIsAddGradeOpen(open);
          if (!open) {
            setEditingGrade(null);
            setNewGrade({ studentId: '', assignmentId: '', teacherId: '', value: '', note: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Выставить оценку
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingGrade ? 'Редактировать оценку' : 'Новая оценка'}</DialogTitle>
              <DialogDescription>
                {editingGrade ? 'Измените данные оценки' : 'Выставите оценку ученику за задание'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="grade-student">Ученик</Label>
                <Select value={newGrade.studentId} onValueChange={(value) => setNewGrade({ ...newGrade, studentId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите ученика" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade-assignment">Задание</Label>
                <Select value={newGrade.assignmentId} onValueChange={(value) => setNewGrade({ ...newGrade, assignmentId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите задание" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments.map(assignment => (
                      <SelectItem key={assignment.id} value={assignment.id}>{assignment.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade-teacher">Преподаватель</Label>
                <Select value={newGrade.teacherId} onValueChange={(value) => setNewGrade({ ...newGrade, teacherId: value })}>
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
                <Label htmlFor="grade-value">Оценка (1-5)</Label>
                <Input
                  id="grade-value"
                  type="number"
                  min="1"
                  max="5"
                  value={newGrade.value}
                  onChange={(e) => setNewGrade({ ...newGrade, value: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="grade-note">Примечание (необязательно)</Label>
                <Textarea
                  id="grade-note"
                  value={newGrade.note}
                  onChange={(e) => setNewGrade({ ...newGrade, note: e.target.value })}
                  placeholder="Комментарий к оценке..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddGrade} className="w-full" disabled={students.length === 0 || assignments.length === 0 || teachers.length === 0}>
                {students.length === 0 || assignments.length === 0 || teachers.length === 0 
                  ? 'Создайте учеников, задания и добавьте преподавателей' 
                  : editingGrade ? 'Сохранить' : 'Выставить оценку'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {grades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              Статистика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Всего оценок</p>
                <p className="text-3xl font-bold">{grades.length}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Средний балл</p>
                <p className="text-3xl font-bold">{calculateAverageGrade()}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Отличных оценок</p>
                <p className="text-3xl font-bold">{grades.filter(g => g.value === 5).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {grades.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Icon name="Award" size={64} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">Нет оценок</h3>
            <p className="text-muted-foreground mb-4">Выставите первую оценку ученику</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {grades.map(grade => (
            <Card key={grade.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full ${getGradeColor(grade.value)} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                      {grade.value}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2">{getStudentName(grade.studentId)}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          <Icon name="BookOpen" size={12} className="mr-1" />
                          {getAssignmentTitle(grade.assignmentId)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Icon name="User" size={12} className="mr-1" />
                          {getTeacherName(grade.teacherId)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Clock" size={12} className="mr-1" />
                          {formatDate(grade.date)}
                        </Badge>
                      </div>
                      {grade.note && (
                        <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                          <Icon name="MessageSquare" size={14} className="inline mr-1" />
                          {grade.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => openEditDialog(grade)}>
                      <Icon name="Pencil" size={16} />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDeleteGrade(grade.id)}>
                      <Icon name="Trash2" size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
