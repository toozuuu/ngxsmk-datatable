import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataProvider, DataRequest, DataResponse } from './data-provider.interface';

/**
 * GraphQL query configuration
 */
export interface GraphQLConfig {
  /** GraphQL endpoint URL */
  url: string;
  
  /** Query for fetching data */
  query: string;
  
  /** Mutation for creating items */
  createMutation?: string;
  
  /** Mutation for updating items */
  updateMutation?: string;
  
  /** Mutation for deleting items */
  deleteMutation?: string;
  
  /** HTTP headers */
  headers?: Record<string, string>;
  
  /** Transform request variables */
  transformVariables?: (request: DataRequest) => Record<string, any>;
  
  /** Transform response data */
  transformResponse?: (response: any) => DataResponse<any>;
}

/**
 * GraphQL data provider
 * Handles server-side pagination, sorting, and filtering via GraphQL
 * 
 * Note: This class is not decorated with @Injectable because it takes configuration
 * in the constructor. Create instances manually.
 * 
 * @example
 * const provider = new GraphQLDataProvider<User>({
 *   url: 'https://api.example.com/graphql',
 *   query: `
 *     query GetUsers($page: Int!, $pageSize: Int!, $sort: [SortInput!], $filter: [FilterInput!]) {
 *       users(page: $page, pageSize: $pageSize, sort: $sort, filter: $filter) {
 *         items { id name email }
 *         total
 *         pageInfo { hasNextPage endCursor }
 *       }
 *     }
 *   `,
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * 
 * provider.fetch({
 *   pagination: { page: 1, pageSize: 50 },
 *   sorting: [{ field: 'name', direction: 'asc' }]
 * }).subscribe(response => {
 *   console.log(response.data);
 * });
 */
export class GraphQLDataProvider<T> implements DataProvider<T> {
  constructor(private config: GraphQLConfig) {}

  /**
   * Fetch data via GraphQL query
   */
  fetch(request: DataRequest): Observable<DataResponse<T>> {
    const variables = this.buildVariables(request);
    const body = {
      query: this.config.query,
      variables
    };

    return this.executeQuery<DataResponse<T>>(body).pipe(
      map(response => this.transformResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create item via GraphQL mutation
   */
  create(item: T): Observable<T> {
    if (!this.config.createMutation) {
      return throwError(() => new Error('Create mutation not configured'));
    }

    const body = {
      query: this.config.createMutation,
      variables: { input: item }
    };

    return this.executeQuery<T>(body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update item via GraphQL mutation
   */
  update(id: string | number, item: Partial<T>): Observable<T> {
    if (!this.config.updateMutation) {
      return throwError(() => new Error('Update mutation not configured'));
    }

    const body = {
      query: this.config.updateMutation,
      variables: { id, input: item }
    };

    return this.executeQuery<T>(body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete item via GraphQL mutation
   */
  delete(id: string | number): Observable<void> {
    if (!this.config.deleteMutation) {
      return throwError(() => new Error('Delete mutation not configured'));
    }

    const body = {
      query: this.config.deleteMutation,
      variables: { id }
    };

    return this.executeQuery<void>(body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Execute GraphQL query/mutation
   */
  private executeQuery<R>(body: any): Observable<R> {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.headers || {})
    };

    return new Observable(observer => {
      fetch(this.config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(result => {
          if (result.errors) {
            throw new Error(result.errors.map((e: any) => e.message).join(', '));
          }
          observer.next(result.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  /**
   * Build GraphQL variables from request
   */
  private buildVariables(request: DataRequest): Record<string, any> {
    // Allow custom transform
    if (this.config.transformVariables) {
      return this.config.transformVariables(request);
    }

    // Default variables
    const variables: Record<string, any> = {
      page: request.pagination.page,
      pageSize: request.pagination.pageSize
    };

    if (request.pagination.cursor) {
      variables['cursor'] = request.pagination.cursor;
    }

    if (request.sorting && request.sorting.length > 0) {
      variables['sort'] = request.sorting.map(sort => ({
        field: sort.field,
        direction: sort.direction.toUpperCase() // GraphQL often uses uppercase
      }));
    }

    if (request.filtering && request.filtering.length > 0) {
      variables['filter'] = request.filtering.map(filter => ({
        field: filter.column.id,
        operator: filter.operator,
        value: filter.value
      }));
    }

    if (request.search) {
      variables['search'] = request.search;
    }

    if (request.params) {
      Object.assign(variables, request.params);
    }

    return variables;
  }

  /**
   * Transform GraphQL response to DataResponse
   */
  private transformResponse(response: any): DataResponse<T> {
    // Allow custom transform
    if (this.config.transformResponse) {
      return this.config.transformResponse(response);
    }

    // Try to auto-detect response structure
    // Look for common GraphQL response patterns
    
    // Pattern 1: { users: { items: [], total: 0, pageInfo: {} } }
    const firstKey = Object.keys(response)[0];
    const data = response[firstKey];

    if (data && data.items && typeof data.total === 'number') {
      return {
        data: data.items,
        total: data.total,
        nextCursor: data.pageInfo?.endCursor,
        prevCursor: data.pageInfo?.startCursor,
        hasNextPage: data.pageInfo?.hasNextPage,
        hasPrevPage: data.pageInfo?.hasPreviousPage
      };
    }

    // Pattern 2: { users: { nodes: [], totalCount: 0, pageInfo: {} } }
    if (data && data.nodes && typeof data.totalCount === 'number') {
      return {
        data: data.nodes,
        total: data.totalCount,
        nextCursor: data.pageInfo?.endCursor,
        prevCursor: data.pageInfo?.startCursor,
        hasNextPage: data.pageInfo?.hasNextPage,
        hasPrevPage: data.pageInfo?.hasPreviousPage
      };
    }

    // Pattern 3: { users: { edges: [{ node: {} }], totalCount: 0, pageInfo: {} } }
    if (data && data.edges && typeof data.totalCount === 'number') {
      return {
        data: data.edges.map((edge: any) => edge.node),
        total: data.totalCount,
        nextCursor: data.pageInfo?.endCursor,
        prevCursor: data.pageInfo?.startCursor,
        hasNextPage: data.pageInfo?.hasNextPage,
        hasPrevPage: data.pageInfo?.hasPreviousPage
      };
    }

    // Fallback
    console.warn('Unknown GraphQL response format. Configure transformResponse:', response);
    return {
      data: [],
      total: 0
    };
  }

  /**
   * Handle errors
   */
  private handleError(error: any): Observable<never> {
    console.error('GraphQLDataProvider error:', error);
    
    const errorMessage = error.message || 'An error occurred while fetching data';
    return throwError(() => new Error(errorMessage));
  }
}

