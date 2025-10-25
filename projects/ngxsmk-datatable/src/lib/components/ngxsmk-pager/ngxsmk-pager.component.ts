import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaginationConfig, PageEvent } from '../../interfaces/pagination.interface';

@Component({
  selector: 'ngxsmk-pager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ngxsmk-pager.component.html',
  styleUrls: ['./ngxsmk-pager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxsmkPagerComponent implements OnInit, OnChanges {
  @Input() config: PaginationConfig | null = null;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() showRefreshButton = false; // PR #2184

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() refresh = new EventEmitter<void>(); // PR #2184

  // Computed properties
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  hasNextPage = false;
  hasPreviousPage = false;
  pageNumbers: number[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.calculatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] || changes['pageSize'] || changes['totalItems']) {
      this.calculatePagination();
    }
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.startIndex = (this.currentPage - 1) * this.pageSize + 1; // +1 for 1-based display
    this.endIndex = Math.min(this.startIndex + this.pageSize - 1, this.totalItems);
    this.hasNextPage = this.currentPage < this.totalPages;
    this.hasPreviousPage = this.currentPage > 1;

    this.generatePageNumbers();
    this.cdr.markForCheck();
  }

  private generatePageNumbers(): void {
    const maxSize = this.config?.maxSize || 5;
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= maxSize) {
      this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
      return;
    }

    const halfMaxSize = Math.floor(maxSize / 2);
    let startPage = Math.max(1, currentPage - halfMaxSize);
    let endPage = Math.min(totalPages, startPage + maxSize - 1);

    if (endPage - startPage + 1 < maxSize) {
      startPage = Math.max(1, endPage - maxSize + 1);
    }

    this.pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.calculatePagination();
      
      this.pageChange.emit({
        page,
        pageSize: this.pageSize,
        length: this.totalItems,
        pageIndex: page - 1,
        previousPageIndex: this.currentPage - 1
      });
    }
  }

  onPageSizeChange(newPageSize: number): void {
    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.currentPage = 1; // Reset to first page
      this.calculatePagination();
      
      this.pageChange.emit({
        page: 1,
        pageSize: newPageSize,
        length: this.totalItems,
        pageIndex: 0,
        previousPageIndex: 0
      });
    }
  }

  goToFirstPage(): void {
    this.onPageChange(1);
  }

  goToLastPage(): void {
    this.onPageChange(this.totalPages);
  }

  // PR #2184: Refresh button handler
  onRefresh(): void {
    this.refresh.emit();
  }

  goToPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.hasNextPage) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  getPageSizeOptions(): number[] {
    return this.config?.pageSizeOptions || [10, 25, 50, 100];
  }

  getRangeLabel(): string {
    if (this.totalItems === 0) {
      return '0 of 0';
    }
    return `${this.startIndex + 1}-${this.endIndex + 1} of ${this.totalItems}`;
  }

  getTotalItemsLabel(): string {
    return `${this.totalItems} items`;
  }

  isPageNumberVisible(page: number): boolean {
    return this.pageNumbers.includes(page);
  }

  shouldShowEllipsisBefore(): boolean {
    return this.pageNumbers.length > 0 && this.pageNumbers[0] > 1;
  }

  shouldShowEllipsisAfter(): boolean {
    return this.pageNumbers.length > 0 && this.pageNumbers[this.pageNumbers.length - 1] < this.totalPages;
  }
}
