import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetUserProfileUseCase {
  // Note: This would typically use a repository
  execute(): Observable<User | null> {
    // This is a placeholder implementation
    // In a real app, this would fetch from a repository
    return new Observable(observer => {
      const storedUser = localStorage.getItem('streamflow_user');
      if (storedUser) {
        observer.next(JSON.parse(storedUser));
      } else {
        observer.next(null);
      }
      observer.complete();
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateUserProfileUseCase {
  execute(data: UpdateUserProfileData): Observable<User> {
    return new Observable(observer => {
      // This is a placeholder implementation
      // In a real app, this would update via a repository
      const currentUser = JSON.parse(localStorage.getItem('streamflow_user') || '{}');
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('streamflow_user', JSON.stringify(updatedUser));
      observer.next(updatedUser);
      observer.complete();
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class UploadProfilePictureUseCase {
  execute(file: File): Observable<string> {
    return new Observable(observer => {
      // This is a placeholder implementation
      // In a real app, this would upload to a file service
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Store the base64 string as profile picture URL
        observer.next(base64String);
        observer.complete();
      };
      reader.onerror = () => observer.error('Error reading file');
      reader.readAsDataURL(file);
    });
  }
}
