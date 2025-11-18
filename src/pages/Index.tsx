import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import LoginPage from '@/components/LoginPage';
import ClassesTab from '@/components/ClassesTab';
import ScheduleTab from '@/components/ScheduleTab';
import AssignmentsTab from '@/components/AssignmentsTab';
import GradesTab from '@/components/GradesTab';
import UsersTab from '@/components/UsersTab';
import { auth, AuthUser } from '@/lib/storage';

export default function Index() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const user = auth.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogin = () => {
    const user = auth.getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isTeacher = currentUser.role === 'teacher';
  const isStudent = currentUser.role === 'student';
  const isParent = currentUser.role === 'parent';

  const getRoleLabel = () => {
    switch (currentUser.role) {
      case 'teacher': return 'Преподаватель';
      case 'student': return 'Ученик';
      case 'parent': return 'Родитель';
      default: return 'Пользователь';
    }
  };

  const getRoleIcon = () => {
    switch (currentUser.role) {
      case 'teacher': return 'Briefcase';
      case 'student': return 'GraduationCap';
      case 'parent': return 'UserCheck';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="GraduationCap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">КиберШкола</h1>
                <p className="text-xs text-muted-foreground">Образовательная платформа</p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon name={getRoleIcon()} size={16} className="mr-2" />
                  {currentUser.name}
                  <Icon name="ChevronDown" size={14} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${isTeacher ? 6 : isStudent ? 3 : 2}, minmax(0, 1fr))` }}>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Icon name="LayoutDashboard" size={16} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            
            {isTeacher && (
              <>
                <TabsTrigger value="classes" className="flex items-center gap-2">
                  <Icon name="Users" size={16} />
                  <span className="hidden sm:inline">Классы</span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  <span className="hidden sm:inline">Расписание</span>
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <Icon name="BookOpen" size={16} />
                  <span className="hidden sm:inline">Задания</span>
                </TabsTrigger>
                <TabsTrigger value="grades" className="flex items-center gap-2">
                  <Icon name="Award" size={16} />
                  <span className="hidden sm:inline">Успеваемость</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Icon name="UserCog" size={16} />
                  <span className="hidden sm:inline">Пользователи</span>
                </TabsTrigger>
              </>
            )}

            {isStudent && (
              <>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  <span className="hidden sm:inline">Расписание</span>
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <Icon name="BookOpen" size={16} />
                  <span className="hidden sm:inline">Задания</span>
                </TabsTrigger>
              </>
            )}

            {isParent && (
              <TabsTrigger value="grades" className="flex items-center gap-2">
                <Icon name="Award" size={16} />
                <span className="hidden sm:inline">Успеваемость</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon name="Users" size={16} className="text-primary" />
                    Всего учеников
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground mt-1">В 0 классах</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon name="BookOpen" size={16} className="text-secondary" />
                    Активных заданий
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground mt-1">Ожидают проверки</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon name="Calendar" size={16} className="text-primary" />
                    Уроков сегодня
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground mt-1">По расписанию</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon name="TrendingUp" size={16} className="text-secondary" />
                    Средний балл
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground mt-1">За последний месяц</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} className="text-primary" />
                    Расписание на сегодня
                  </CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="CalendarOff" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Нет уроков на сегодня</p>
                    {isTeacher && (
                      <Button variant="link" className="mt-2" onClick={() => setActiveTab('schedule')}>
                        Создать расписание
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BookOpen" size={20} className="text-secondary" />
                    Последние задания
                  </CardTitle>
                  <CardDescription>Недавно созданные задания</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Нет созданных заданий</p>
                    {isTeacher && (
                      <Button variant="link" className="mt-2" onClick={() => setActiveTab('assignments')}>
                        Создать задание
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {isTeacher && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Rocket" size={20} className="text-primary" />
                    Быстрый старт
                  </CardTitle>
                  <CardDescription>Начните работу с платформой</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto flex-col items-start p-4 hover:border-primary" onClick={() => setActiveTab('classes')}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Users" size={20} className="text-primary" />
                        <span className="font-semibold">Создать класс</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">Добавьте учеников и преподавателей</p>
                    </Button>
                    
                    <Button variant="outline" className="h-auto flex-col items-start p-4 hover:border-secondary" onClick={() => setActiveTab('schedule')}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Calendar" size={20} className="text-secondary" />
                        <span className="font-semibold">Настроить расписание</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">Создайте расписание уроков</p>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {isTeacher && (
            <>
              <TabsContent value="classes" className="animate-fade-in">
                <ClassesTab />
              </TabsContent>

              <TabsContent value="schedule" className="animate-fade-in">
                <ScheduleTab />
              </TabsContent>

              <TabsContent value="assignments" className="animate-fade-in">
                <AssignmentsTab />
              </TabsContent>

              <TabsContent value="grades" className="animate-fade-in">
                <GradesTab />
              </TabsContent>

              <TabsContent value="users" className="animate-fade-in">
                <UsersTab />
              </TabsContent>
            </>
          )}

          {isStudent && (
            <>
              <TabsContent value="schedule" className="animate-fade-in">
                <ScheduleTab />
              </TabsContent>

              <TabsContent value="assignments" className="animate-fade-in">
                <AssignmentsTab />
              </TabsContent>
            </>
          )}

          {isParent && (
            <TabsContent value="grades" className="animate-fade-in">
              <GradesTab />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
