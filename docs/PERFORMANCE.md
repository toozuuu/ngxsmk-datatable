# Performance Tips

Optimize ngxsmk-datatable for maximum performance with large datasets.

---

## Table of Contents

- [Virtual Scrolling](#virtual-scrolling)
- [Change Detection](#change-detection)
- [Pagination Strategies](#pagination-strategies)
- [Sorting Optimization](#sorting-optimization)
- [Memory Management](#memory-management)
- [Best Practices](#best-practices)
- [Benchmarks](#benchmarks)

---

## Virtual Scrolling

### Enable Virtual Scrolling

Always enable for datasets over 100 rows:

```typescript
<ngxsmk-datatable
  [virtualScrolling]="true"
  [rowHeight]="50"
  [rows]="largeDataset">
</ngxsmk-datatable>
```

### How It Works

Virtual scrolling only renders visible rows plus a small buffer:

- **Without Virtual Scrolling**: Renders all 10,000 rows → Slow
- **With Virtual Scrolling**: Renders only ~20 visible rows → Fast

### Optimal Row Heights

```typescript
// Fast (Fixed height - no calculations)
[rowHeight]="50"

// Slower (Dynamic height - requires measurements)
[rowHeight]="'auto'"
```

**Recommendation**: Use fixed row heights for best performance.

### Buffer Size

The component automatically calculates buffer size:

```typescript
// Internal calculation
bufferSize = Math.min(5, Math.floor(visibleRowCount / 2));
```

This ensures smooth scrolling without lag.

---

## Change Detection

### OnPush Strategy

ngxsmk-datatable uses `OnPush` change detection by default:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Benefits:**
- Only checks when inputs change
- Significantly faster for large datasets
- Reduces unnecessary renders

### Immutable Updates

Always create new arrays/objects when updating data:

```typescript
// ❌ Bad - Mutates array (OnPush won't detect)
this.rows.push(newRow);

// ✅ Good - Creates new array
this.rows = [...this.rows, newRow];

// ❌ Bad - Mutates object
this.rows[0].name = 'New Name';

// ✅ Good - Creates new object
this.rows = this.rows.map((row, index) =>
  index === 0 ? { ...row, name: 'New Name' } : row
);
```

### TrackBy Function

Use `trackByProp` for efficient row updates:

```typescript
<ngxsmk-datatable
  [rows]="rows"
  [trackByProp]="'id'">
</ngxsmk-datatable>
```

This tells Angular to track rows by ID instead of object reference.

---

## Pagination Strategies

### Client-Side Pagination

Good for datasets up to 10,000 rows:

```typescript
<ngxsmk-datatable
  [rows]="allRows"
  [pagination]="{
    pageSize: 50,
    totalItems: allRows.length
  }">
</ngxsmk-datatable>
```

**Pros:**
- Fast page switching
- No server calls
- Works offline

**Cons:**
- Initial load time for large datasets
- High memory usage

### Server-Side Pagination

Required for datasets over 10,000 rows:

```typescript
<ngxsmk-datatable
  [rows]="currentPageRows"
  [externalPaging]="true"
  [pagination]="{
    pageSize: 50,
    totalItems: totalCount,
    currentPage: currentPage
  }"
  (page)="loadPage($event)">
</ngxsmk-datatable>

loadPage(event: PageEvent) {
  this.loading = true;
  this.apiService.getPage(event.page, event.pageSize)
    .subscribe(data => {
      this.currentPageRows = data.rows;
      this.totalCount = data.total;
      this.loading = false;
    });
}
```

**Pros:**
- Fast initial load
- Low memory usage
- Scalable to millions of rows

**Cons:**
- Network latency
- Requires backend support

### Optimal Page Sizes

| Dataset Size | Recommended Page Size |
|--------------|----------------------|
| < 1,000 | 25-50 |
| 1,000 - 10,000 | 50-100 |
| > 10,000 | 100-200 |

```typescript
pagination = {
  pageSize: 50,
  pageSizeOptions: [25, 50, 100, 200]
};
```

---

## Sorting Optimization

### Client-Side Sorting

Fast for up to 10,000 rows:

```typescript
<ngxsmk-datatable
  [columns]="columns"
  [rows]="rows">
</ngxsmk-datatable>
```

The component handles sorting automatically.

### Server-Side Sorting

Use for large datasets:

```typescript
<ngxsmk-datatable
  [externalSorting]="true"
  [rows]="rows"
  (sort)="onSort($event)">
</ngxsmk-datatable>

onSort(event: SortEvent) {
  this.loading = true;
  this.apiService.getSorted(event.column.prop, event.newValue)
    .subscribe(data => {
      this.rows = data;
      this.loading = false;
    });
}
```

### Sort Performance Tips

1. **Index Columns** - Ensure sorted columns are indexed in database
2. **Limit Sortable Columns** - Only make necessary columns sortable
3. **Cache Results** - Cache common sort orders
4. **Debounce Requests** - Prevent rapid re-sorting

```typescript
// Debounce sort requests
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

sortSubject = new Subject<SortEvent>();

ngOnInit() {
  this.sortSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(event => {
    this.loadSortedData(event);
  });
}

onSort(event: SortEvent) {
  this.sortSubject.next(event);
}
```

---

## Memory Management

### Cleanup on Destroy

The component automatically cleans up resources:

```typescript
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
  this.visibleRows = [];
  this.rows = [];
}
```

### Avoid Memory Leaks

1. **Unsubscribe from Observables**

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.dataService.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.rows = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

2. **Clear Intervals and Timeouts**

```typescript
private refreshInterval: any;

ngOnInit() {
  this.refreshInterval = setInterval(() => {
    this.loadData();
  }, 30000);
}

ngOnDestroy() {
  if (this.refreshInterval) {
    clearInterval(this.refreshInterval);
  }
}
```

3. **Remove Event Listeners**

```typescript
ngOnInit() {
  window.addEventListener('resize', this.onResize);
}

ngOnDestroy() {
  window.removeEventListener('resize', this.onResize);
}
```

### Lazy Loading

Load data only when needed:

```typescript
@Component({
  template: `
    @if (showTable) {
      <ngxsmk-datatable [rows]="rows">
      </ngxsmk-datatable>
    }
  `
})
export class LazyLoadComponent {
  showTable = false;
  rows: any[] = [];
  
  loadTable() {
    this.showTable = true;
    this.loadData();
  }
}
```

---

## Best Practices

### 1. Optimize Column Width

```typescript
columns = [
  // Fixed width for small columns
  { id: 'id', name: 'ID', width: 80 },
  
  // FlexGrow for responsive columns
  { id: 'name', name: 'Name', flexGrow: 2 },
  { id: 'email', name: 'Email', flexGrow: 3 },
  
  // Min/Max for controlled flexibility
  { id: 'status', name: 'Status', minWidth: 100, maxWidth: 150 }
];
```

### 2. Minimize Template Complexity

```typescript
// ❌ Bad - Heavy computation in template
<ng-template #cellTemplate let-value="value">
  {{ calculateComplexValue(value) }}
</ng-template>

// ✅ Good - Pre-compute values
ngOnInit() {
  this.rows = this.rows.map(row => ({
    ...row,
    computedValue: this.calculateComplexValue(row.value)
  }));
}
```

### 3. Use Simple Cell Templates

```typescript
// ❌ Bad - Complex nested components
<ng-template #cellTemplate let-row="row">
  <heavy-component [data]="row"></heavy-component>
</ng-template>

// ✅ Good - Simple HTML
<ng-template #cellTemplate let-value="value">
  <span class="badge">{{ value }}</span>
</ng-template>
```

### 4. Freeze Fewer Columns

```typescript
// ❌ Bad - Too many frozen columns
columns = [
  { id: 'col1', frozen: 'left' },
  { id: 'col2', frozen: 'left' },
  { id: 'col3', frozen: 'left' },
  { id: 'col4', frozen: 'right' },
  { id: 'col5', frozen: 'right' }
];

// ✅ Good - Minimal frozen columns
columns = [
  { id: 'actions', frozen: 'left' },
  // ... other columns ...
  { id: 'status', frozen: 'right' }
];
```

### 5. Debounce Search/Filter

```typescript
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

searchTermSubject = new Subject<string>();

ngOnInit() {
  this.searchTermSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(term => {
    this.filterRows(term);
  });
}

onSearch(term: string) {
  this.searchTermSubject.next(term);
}
```

### 6. Limit Initial Data

```typescript
// ❌ Bad - Load everything upfront
ngOnInit() {
  this.loadAllData(); // 100,000 rows
}

// ✅ Good - Load progressively
ngOnInit() {
  this.loadInitialData(); // 50 rows
}

loadMore() {
  this.loadNextPage();
}
```

---

## Benchmarks

### Render Performance

Tested on MacBook Pro M1, 16GB RAM, Chrome 120

| Rows | Virtual Scroll | Render Time | Memory |
|------|----------------|-------------|--------|
| 100 | OFF | 45ms | 2MB |
| 100 | ON | 38ms | 1.8MB |
| 1,000 | OFF | 280ms | 15MB |
| 1,000 | ON | 90ms | 4MB |
| 10,000 | OFF | 2,400ms | 145MB |
| 10,000 | ON | 220ms | 12MB |

### Scroll Performance

| Rows | Virtual Scroll | FPS | Smooth? |
|------|----------------|-----|---------|
| 100 | OFF | 60 | ✅ |
| 1,000 | OFF | 35 | ⚠️ |
| 10,000 | OFF | 10 | ❌ |
| 10,000 | ON | 58 | ✅ |

### Memory Usage Over Time

| Operation | Without Cleanup | With Cleanup |
|-----------|----------------|--------------|
| Initial Load | 50MB | 50MB |
| After 10 loads | 150MB | 52MB |
| After 50 loads | 450MB | 54MB |

**Conclusion**: Proper cleanup is essential for long-running applications.

---

## Performance Checklist

Before deploying to production:

- [ ] Enable virtual scrolling for large datasets
- [ ] Use fixed row heights
- [ ] Implement server-side pagination for >10K rows
- [ ] Set `trackByProp` on rows
- [ ] Use OnPush change detection (built-in)
- [ ] Minimize frozen columns
- [ ] Optimize cell templates
- [ ] Debounce search/filter
- [ ] Implement proper cleanup
- [ ] Test with production data volume
- [ ] Monitor memory usage
- [ ] Check scroll performance (should be 60fps)

---

## Profiling

### Chrome DevTools

1. Open DevTools → Performance
2. Click Record
3. Interact with table (scroll, sort, filter)
4. Stop recording
5. Analyze flame chart

Look for:
- Long tasks (>50ms)
- Frequent layout thrashing
- Memory spikes

### Angular DevTools

1. Install Angular DevTools extension
2. Open DevTools → Angular
3. Click "Profiler"
4. Record interaction
5. Check change detection cycles

### Memory Profiling

1. DevTools → Memory
2. Take heap snapshot
3. Interact with table
4. Take another snapshot
5. Compare for leaks

---

## Related Documentation

- [API Reference](./API.md)
- [Installation Guide](./INSTALLATION.md)
- [Customization Guide](./CUSTOMIZATION.md)
- [Examples](./EXAMPLES.md)

