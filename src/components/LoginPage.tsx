import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { auth } from '@/lib/storage';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      toast.error('Заполните все поля');
      return;
    }

    const user = auth.login(email, password);
    if (user) {
      toast.success(`Добро пожаловать, ${user.name}!`);
      onLogin();
    } else {
      toast.error('Неверный email или пароль');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
            <Icon name="GraduationCap" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">КиберШкола</h1>
          <p className="text-muted-foreground mt-2">Образовательная платформа</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>Введите свои учетные данные</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@cyberschool.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-center mb-3">Демо-аккаунты для входа:</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-background rounded">
                  <Icon name="User" size={14} className="text-primary" />
                  <div className="flex-1 text-xs">
                    <p className="font-medium">Преподаватель</p>
                    <p className="text-muted-foreground">teacher@demo.ru / demo123</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-background rounded">
                  <Icon name="User" size={14} className="text-secondary" />
                  <div className="flex-1 text-xs">
                    <p className="font-medium">Ученик</p>
                    <p className="text-muted-foreground">student@demo.ru / demo123</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-background rounded">
                  <Icon name="User" size={14} className="text-accent" />
                  <div className="flex-1 text-xs">
                    <p className="font-medium">Родитель</p>
                    <p className="text-muted-foreground">parent@demo.ru / demo123</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
