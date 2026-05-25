import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  records: any[] = [];
  users: any[] = [];
  isLoadingRecords = true;
  isLoadingUsers = false;
  recordsError = '';
  usersError = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.user = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadRecords();
    
    if (this.isAdmin) {
      this.loadUsers();
    }
  }

  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  loadRecords() {
    this.isLoadingRecords = true;
    
    // Admin gets all records, General User gets only their records.
    // However, the prompt says "API call to get a list of records for the user".
    // I'll call getRecords(userId) for regular user, or getAllRecords for Admin,
    // or just let the API handle it if we passed a param. We'll pass userId for general, nothing for admin.
    
    const request = this.isAdmin 
      ? this.userService.getAllRecords()
      : this.userService.getRecords(this.user.userId);

    request.subscribe({
      next: (res) => {
        this.records = res.records;
        this.isLoadingRecords = false;
      },
      error: (err) => {
        this.recordsError = 'Failed to load records.';
        this.isLoadingRecords = false;
      }
    });
  }

  loadUsers() {
    this.isLoadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users;
        this.isLoadingUsers = false;
      },
      error: (err) => {
        this.usersError = 'Failed to load users.';
        this.isLoadingUsers = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
  editUser(u: any) {
  const newName = prompt('Enter new name', u.name);

  if (newName && newName.trim() !== '') {

    this.userService.updateUser(u.userId, {
      name: newName
    }).subscribe({
      next: (res) => {
        u.name = res.user.name;
        alert('User updated successfully');
      },
      error: () => {
        alert('Failed to update user');
      }
    });

  }
}
}

