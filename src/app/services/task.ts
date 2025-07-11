import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

export interface TaskModel {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

@Injectable({
  providedIn: 'root'
})
export class Task {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient, private auth: Auth) {}

  private getHeaders() {
    const token = this.auth.getToken();
    console.log('Using token:', token);
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getTasks(): Observable<TaskModel[]> {
    console.log('Fetching tasks from:', this.apiUrl);
    return this.http.get<TaskModel[]>(this.apiUrl, this.getHeaders());
  }

  addTask(task: TaskModel): Observable<TaskModel> {
    console.log('Adding task:', task);
    console.log('Headers:', this.getHeaders());
    return this.http.post<TaskModel>(this.apiUrl, task, this.getHeaders());
  }

  updateTask(task: TaskModel): Observable<TaskModel> {
    console.log('Updating task:', task);
    return this.http.put<TaskModel>(`${this.apiUrl}/${task.id}`, task, this.getHeaders());
  }

  deleteTask(id: number): Observable<any> {
    console.log('Deleting task with ID:', id);
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
