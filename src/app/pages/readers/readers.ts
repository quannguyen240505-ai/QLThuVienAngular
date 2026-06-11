import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReaderService } from '../../services/reader.service';
import { Reader } from '../../models/reader';

@Component({
  selector: 'app-readers',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './readers.html',
  styleUrl: './readers.css',
})
export class Readers {
  readers: Reader[] = [];
  keyword = '';

  constructor(
    private readerService: ReaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReaders();
  }

  get activeCount(): number {
    return this.readers.filter(x => x.status === 'Active').length;
  }

  get inactiveCount(): number {
    return this.readers.filter(x => x.status !== 'Active').length;
  }

  loadReaders(): void {
    this.keyword = '';

    this.readerService.getReaders().subscribe({
      next: data => {
        this.readers = data;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log(err);
        alert('Không thể tải danh sách độc giả.');
      }
    });
  }

  search(): void {
    if (!this.keyword.trim()) {
      this.loadReaders();
      return;
    }

    this.readerService.searchReaders(this.keyword).subscribe({
      next: data => {
        this.readers = data;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log(err);
        alert('Không thể tìm kiếm độc giả.');
      }
    });
  }

  deleteReader(id: number): void {
    if (!confirm('Bạn có chắc muốn xóa độc giả này không?')) {
      return;
    }

    this.readerService.deleteReader(id).subscribe({
      next: () => {
        this.loadReaders();
      },
      error: err => {
        alert(err.error?.message ?? err.error ?? 'Không thể xóa độc giả.');
      }
    });
  }
}