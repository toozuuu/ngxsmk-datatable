import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { DataProvider, DataRequest, DataResponse, ServerDataProviderConfig } from './data-provider.interface';

/**
 * REST API data provider
 * Handles server-side pagination, sorting, and filtering
 * 
 * Note: This class is not decorated with @Injectable because it takes configuration
 * in the constructor. Create instances manually.
 * 
 * @example
 * const provider = new RestDataProvider<User>(http, {
 *   mode: 'server',
 *   url: 'https://api.example.com/users',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * 
 * provider.fetch({
 *   pagination: { page: 1, pageSize: 50 },
 *   sorting: [{ field: 'name', direction: 'asc' }],
 *   filtering: [{ column: { id: 'status' }, value: 'active', operator: 'equals', type: 'text' }]
 * }).subscribe(response => {
 *   console.log(response.data); // User[]
 *   console.log(response.total); // Total count
 * });
 */
export class RestDataProvider<T> implements DataProvider<T> {
  constructor(
    private http: HttpClient,
    private config: ServerDataProviderConfig
  ) {}

  /**
   * Fetch data from REST API
   */
  fetch(request: DataRequest): Observable<DataResponse<T>> {
    const url = this.buildUrl(request);
    const params = this.buildParams(request);
    const headers = this.config.headers || {};

    return this.http.get<any>(url, { params, headers }).pipe(
      map(response => this.transformResponse(response)),
      retry(this.config.retry ? (this.config.maxRetries || 3) : 0),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create a new item
   */
  create(item: T): Observable<T> {
    const headers = this.config.headers || {};
    return this.http.post<T>(this.config.url, item, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update an existing item
   */
  update(id: string | number, item: Partial<T>): Observable<T> {
    const url = `${this.config.url}/${id}`;
    const headers = this.config.headers || {};
    return this.http.patch<T>(url, item, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete an item
   */
  delete(id: string | number): Observable<void> {
    const url = `${this.config.url}/${id}`;
    const headers = this.config.headers || {};
    return this.http.delete<void>(url, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Batch update multiple items
   */
  batchUpdate(updates: Array<{ id: string | number; data: Partial<T> }>): Observable<T[]> {
    const url = `${this.config.url}/batch`;
    const headers = this.config.headers || {};
    return this.http.patch<T[]>(url, { updates }, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Batch delete multiple items
   */
  batchDelete(ids: (string | number)[]): Observable<void> {
    const url = `${this.config.url}/batch`;
    const headers = this.config.headers || {};
    return this.http.request<void>('DELETE', url, { 
      body: { ids },
      headers 
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Build full URL with path parameters
   */
  private buildUrl(request: DataRequest): string {
    let url = this.config.url;
    
    // Replace path parameters if any
    if (request.params) {
      Object.keys(request.params).forEach(key => {
        url = url.replace(`{${key}}`, request.params![key]);
      });
    }
    
    return url;
  }

  /**
   * Build HTTP query parameters
   */
  private buildParams(request: DataRequest): HttpParams {
    let params = new HttpParams();

    // Pagination
    params = params.set('page', request.pagination.page.toString());
    params = params.set('pageSize', request.pagination.pageSize.toString());
    
    if (request.pagination.cursor) {
      params = params.set('cursor', request.pagination.cursor);
    }

    // Sorting
    if (request.sorting && request.sorting.length > 0) {
      // Support multiple formats
      // Option 1: JSON array
      params = params.set('sort', JSON.stringify(request.sorting));
      
      // Option 2: Multiple sort parameters (uncomment if needed)
      // request.sorting.forEach((sort, index) => {
      //   params = params.set(`sort[${index}]`, `${sort.field}:${sort.direction}`);
      // });
    }

    // Filtering
    if (request.filtering && request.filtering.length > 0) {
      // Support multiple formats
      // Option 1: JSON array
      params = params.set('filter', JSON.stringify(request.filtering));
      
      // Option 2: Individual filter parameters (uncomment if needed)
      // request.filtering.forEach(filter => {
      //   params = params.set(`filter[${filter.column.id}]`, filter.value);
      // });
    }

    // Search
    if (request.search) {
      params = params.set('search', request.search);
    }

    // Additional custom parameters
    if (request.params) {
      Object.keys(request.params).forEach(key => {
        if (!key.startsWith('{')) { // Skip path parameters
          params = params.set(key, request.params![key]);
        }
      });
    }

    return params;
  }

  /**
   * Transform API response to DataResponse
   */
  private transformResponse(response: any): DataResponse<T> {
    // Allow custom transform
    if (this.config.transformResponse) {
      return this.config.transformResponse(response);
    }

    // Default transform - supports common API formats
    
    // Format 1: { data: [], total: 0 }
    if (response.data && typeof response.total === 'number') {
      return {
        data: response.data,
        total: response.total,
        nextCursor: response.nextCursor,
        prevCursor: response.prevCursor,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
        metadata: response.metadata
      };
    }

    // Format 2: { items: [], count: 0 }
    if (response.items && typeof response.count === 'number') {
      return {
        data: response.items,
        total: response.count,
        nextCursor: response.nextCursor,
        prevCursor: response.prevCursor,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage
      };
    }

    // Format 3: { results: [], totalCount: 0 }
    if (response.results && typeof response.totalCount === 'number') {
      return {
        data: response.results,
        total: response.totalCount,
        nextCursor: response.nextCursor,
        prevCursor: response.prevCursor,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage
      };
    }

    // Format 4: Array directly (assume no pagination info)
    if (Array.isArray(response)) {
      return {
        data: response,
        total: response.length
      };
    }

    // Fallback
    console.warn('Unknown API response format. Configure transformResponse to handle it:', response);
    return {
      data: [],
      total: 0
    };
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('RestDataProvider error:', error);
    
    let errorMessage = 'An error occurred while fetching data';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.message || error.statusText || errorMessage;
    }

    return throwError(() => new Error(errorMessage));
  }
}

