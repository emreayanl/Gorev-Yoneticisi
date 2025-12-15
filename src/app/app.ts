import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from './task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  newTaskTitle: string = '';
  newCategory: string = 'İş';
  newPriority: 'Düşük' | 'Orta' | 'Yüksek' = 'Orta';
  newDeadline: string = '';

  filterCategory: string = 'Tümü';
  filterStatus: string = 'Tümü';
  sortOption: string = 'date-asc'; 

  taskList: Task[] = [];


  editingTaskId: number | null = null;

  ngOnInit() {
    this.loadTasks();
  }

  get filteredTasks() {
    let list = this.taskList.filter(task => {
      const categoryMatch = this.filterCategory === 'Tümü' || task.category === this.filterCategory;
      const statusMatch = this.filterStatus === 'Tümü' ||
                          (this.filterStatus === 'Tamamlananlar' && task.isCompleted) ||
                          (this.filterStatus === 'Yapılacaklar' && !task.isCompleted);
      return categoryMatch && statusMatch;
    });

    return list.sort((a, b) => {
      if (this.sortOption === 'date-asc') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      } else if (this.sortOption === 'priority-desc') {
        const priorityMap: { [key: string]: number } = { 'Yüksek': 3, 'Orta': 2, 'Düşük': 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
      }
      return 0;
    });
  }


  saveTask() {
    if (this.newTaskTitle.trim() === '') return;

    if (this.editingTaskId) {


      const taskIndex = this.taskList.findIndex(t => t.id === this.editingTaskId);
      if (taskIndex > -1) {

        this.taskList[taskIndex].title = this.newTaskTitle;
        this.taskList[taskIndex].category = this.newCategory;
        this.taskList[taskIndex].priority = this.newPriority;
        this.taskList[taskIndex].deadline = this.newDeadline;
      }
      this.editingTaskId = null;
    } else {

      const newTask: Task = {
        id: Date.now(),
        title: this.newTaskTitle,
        category: this.newCategory,
        priority: this.newPriority,
        deadline: this.newDeadline,
        isCompleted: false
      };
      this.taskList.push(newTask);
    }

    this.saveTasks();
    this.resetForm();
  }


  startEditing(task: Task) {
    this.editingTaskId = task.id; 
    this.newTaskTitle = task.title; 
    this.newCategory = task.category;
    this.newPriority = task.priority;
    this.newDeadline = task.deadline || '';
    

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  cancelEdit() {
    this.editingTaskId = null;
    this.resetForm();
  }

  resetForm() {
    this.newTaskTitle = '';
    this.newCategory = 'İş';
    this.newPriority = 'Orta';
    this.newDeadline = '';
  }

  deleteTask(taskToDelete: Task) {

    if (this.editingTaskId === taskToDelete.id) {
      this.cancelEdit();
    }
    
    const index = this.taskList.indexOf(taskToDelete);
    if (index > -1) {
      this.taskList.splice(index, 1);
      this.saveTasks();
    }
  }

  toggleCompletion(task: Task) {
    task.isCompleted = !task.isCompleted;
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('my_tasks', JSON.stringify(this.taskList));
  }

  loadTasks() {
    const data = localStorage.getItem('my_tasks');
    if (data) {
      this.taskList = JSON.parse(data);
    }
  }
}