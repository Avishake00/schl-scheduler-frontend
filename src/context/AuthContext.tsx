import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { loginStudent } from '@/lib/api-service';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock teachers for demo
const MOCK_TEACHERS: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'teacher@gmail.com',
    role: 'teacher',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=3b82f6&color=fff'
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'teacher@example.com',
    role: 'teacher',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=60a5fa&color=fff'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'teacher' | 'student') => {
    setLoading(true);
    setError(null);

    try {
      if (role === 'teacher') {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const foundTeacher = MOCK_TEACHERS.find(u => u.email === email);
        if (foundTeacher && password === 'password') {
          setUser(foundTeacher);
          localStorage.setItem('user', JSON.stringify(foundTeacher));
        } else {
          throw new Error('Invalid credentials for teacher');
        }

      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await loginStudent(email, password); // password is studentId
        const data = res.student;

        const studentUser: User = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: 'student',
          avatar: `https://ui-avatars.com/api/?name=${data.name}&background=3b82f6&color=fff`,
        };

        setUser(studentUser);
        localStorage.setItem('user', JSON.stringify(studentUser));
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
