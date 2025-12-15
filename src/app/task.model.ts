export interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  priority: 'Düşük' | 'Orta' | 'Yüksek';
  deadline?: string; 
  isCompleted: boolean;
}