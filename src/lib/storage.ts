export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
  parentIds: string[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  studentIds: string[];
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
}

export interface Schedule {
  id: string;
  classId: string;
  teacherId: string;
  subject: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Assignment {
  id: string;
  classId: string;
  teacherId: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  teacherId: string;
  value: number;
  note?: string;
  date: string;
}

const STORAGE_KEYS = {
  STUDENTS: 'cyber_school_students',
  TEACHERS: 'cyber_school_teachers',
  PARENTS: 'cyber_school_parents',
  CLASSES: 'cyber_school_classes',
  SCHEDULES: 'cyber_school_schedules',
  ASSIGNMENTS: 'cyber_school_assignments',
  GRADES: 'cyber_school_grades',
};

function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  students: {
    getAll: (): Student[] => getFromStorage<Student>(STORAGE_KEYS.STUDENTS),
    add: (student: Student) => {
      const students = storage.students.getAll();
      students.push(student);
      saveToStorage(STORAGE_KEYS.STUDENTS, students);
    },
    update: (id: string, updates: Partial<Student>) => {
      const students = storage.students.getAll();
      const index = students.findIndex(s => s.id === id);
      if (index !== -1) {
        students[index] = { ...students[index], ...updates };
        saveToStorage(STORAGE_KEYS.STUDENTS, students);
      }
    },
    delete: (id: string) => {
      const students = storage.students.getAll().filter(s => s.id !== id);
      saveToStorage(STORAGE_KEYS.STUDENTS, students);
    },
  },
  teachers: {
    getAll: (): Teacher[] => getFromStorage<Teacher>(STORAGE_KEYS.TEACHERS),
    add: (teacher: Teacher) => {
      const teachers = storage.teachers.getAll();
      teachers.push(teacher);
      saveToStorage(STORAGE_KEYS.TEACHERS, teachers);
    },
    update: (id: string, updates: Partial<Teacher>) => {
      const teachers = storage.teachers.getAll();
      const index = teachers.findIndex(t => t.id === id);
      if (index !== -1) {
        teachers[index] = { ...teachers[index], ...updates };
        saveToStorage(STORAGE_KEYS.TEACHERS, teachers);
      }
    },
    delete: (id: string) => {
      const teachers = storage.teachers.getAll().filter(t => t.id !== id);
      saveToStorage(STORAGE_KEYS.TEACHERS, teachers);
    },
  },
  parents: {
    getAll: (): Parent[] => getFromStorage<Parent>(STORAGE_KEYS.PARENTS),
    add: (parent: Parent) => {
      const parents = storage.parents.getAll();
      parents.push(parent);
      saveToStorage(STORAGE_KEYS.PARENTS, parents);
    },
    update: (id: string, updates: Partial<Parent>) => {
      const parents = storage.parents.getAll();
      const index = parents.findIndex(p => p.id === id);
      if (index !== -1) {
        parents[index] = { ...parents[index], ...updates };
        saveToStorage(STORAGE_KEYS.PARENTS, parents);
      }
    },
    delete: (id: string) => {
      const parents = storage.parents.getAll().filter(p => p.id !== id);
      saveToStorage(STORAGE_KEYS.PARENTS, parents);
    },
  },
  classes: {
    getAll: (): Class[] => getFromStorage<Class>(STORAGE_KEYS.CLASSES),
    add: (classData: Class) => {
      const classes = storage.classes.getAll();
      classes.push(classData);
      saveToStorage(STORAGE_KEYS.CLASSES, classes);
    },
    update: (id: string, updates: Partial<Class>) => {
      const classes = storage.classes.getAll();
      const index = classes.findIndex(c => c.id === id);
      if (index !== -1) {
        classes[index] = { ...classes[index], ...updates };
        saveToStorage(STORAGE_KEYS.CLASSES, classes);
      }
    },
    delete: (id: string) => {
      const classes = storage.classes.getAll().filter(c => c.id !== id);
      saveToStorage(STORAGE_KEYS.CLASSES, classes);
    },
  },
  schedules: {
    getAll: (): Schedule[] => getFromStorage<Schedule>(STORAGE_KEYS.SCHEDULES),
    add: (schedule: Schedule) => {
      const schedules = storage.schedules.getAll();
      schedules.push(schedule);
      saveToStorage(STORAGE_KEYS.SCHEDULES, schedules);
    },
    update: (id: string, updates: Partial<Schedule>) => {
      const schedules = storage.schedules.getAll();
      const index = schedules.findIndex(s => s.id === id);
      if (index !== -1) {
        schedules[index] = { ...schedules[index], ...updates };
        saveToStorage(STORAGE_KEYS.SCHEDULES, schedules);
      }
    },
    delete: (id: string) => {
      const schedules = storage.schedules.getAll().filter(s => s.id !== id);
      saveToStorage(STORAGE_KEYS.SCHEDULES, schedules);
    },
  },
  assignments: {
    getAll: (): Assignment[] => getFromStorage<Assignment>(STORAGE_KEYS.ASSIGNMENTS),
    add: (assignment: Assignment) => {
      const assignments = storage.assignments.getAll();
      assignments.push(assignment);
      saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);
    },
    update: (id: string, updates: Partial<Assignment>) => {
      const assignments = storage.assignments.getAll();
      const index = assignments.findIndex(a => a.id === id);
      if (index !== -1) {
        assignments[index] = { ...assignments[index], ...updates };
        saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);
      }
    },
    delete: (id: string) => {
      const assignments = storage.assignments.getAll().filter(a => a.id !== id);
      saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);
    },
  },
  grades: {
    getAll: (): Grade[] => getFromStorage<Grade>(STORAGE_KEYS.GRADES),
    add: (grade: Grade) => {
      const grades = storage.grades.getAll();
      grades.push(grade);
      saveToStorage(STORAGE_KEYS.GRADES, grades);
    },
    update: (id: string, updates: Partial<Grade>) => {
      const grades = storage.grades.getAll();
      const index = grades.findIndex(g => g.id === id);
      if (index !== -1) {
        grades[index] = { ...grades[index], ...updates };
        saveToStorage(STORAGE_KEYS.GRADES, grades);
      }
    },
    delete: (id: string) => {
      const grades = storage.grades.getAll().filter(g => g.id !== id);
      saveToStorage(STORAGE_KEYS.GRADES, grades);
    },
  },
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
