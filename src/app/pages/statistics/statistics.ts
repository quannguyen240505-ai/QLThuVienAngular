import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatisticsService } from '../../services/statistics.service';
import { AuthService } from '../../services/auth.service';
import { ActivityStatisticsResponse } from '../../models/statistics';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.css']
})
export class StatisticsComponent implements OnInit {
  statistics: ActivityStatisticsResponse | null = null;
  isLoading = true;
  errorMessage = '';

  private statsService = inject(StatisticsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadStatistics();
  }

  checkAdminRole(): void {
    const role = this.authService.getRole();
    if (role !== 'Admin') {
      this.router.navigate(['/']);
      alert('Bạn không có quyền truy cập trang thống kê.');
    }
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.statsService.getActivityStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải thống kê:', err);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.errorMessage = 'Bạn không có quyền truy cập chức năng thống kê.';
        } else {
          this.errorMessage = 'Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}