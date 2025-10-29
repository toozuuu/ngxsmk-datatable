import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';
import { DatatableState, StateChangeEvent, StateChangeType, createInitialState, freezeState } from './datatable.state';

/**
 * Immutable state store for datatable
 * Uses RxJS BehaviorSubject for reactive state management
 * 
 * Note: This class is not decorated with @Injectable because it's meant to be 
 * instantiated directly, not injected.
 * 
 * @example
 * const store = new DatatableStore<User>();
 * store.select(state => state.rows).subscribe(rows => console.log(rows));
 * store.update(state => ({ ...state, rows: newRows }));
 */
export class DatatableStore<T = any> {
  private readonly _state$: BehaviorSubject<DatatableState<T>>;
  private readonly _stateChanges$: BehaviorSubject<StateChangeEvent<T> | null>;

  constructor(initialState?: Partial<DatatableState<T>>) {
    const defaultState = createInitialState<T>();
    const state = initialState ? { ...defaultState, ...initialState } : defaultState;
    this._state$ = new BehaviorSubject<DatatableState<T>>(freezeState(state));
    this._stateChanges$ = new BehaviorSubject<StateChangeEvent<T> | null>(null);
  }

  /**
   * Get current state snapshot (immutable)
   */
  get state(): Readonly<DatatableState<T>> {
    return this._state$.value;
  }

  /**
   * Observable stream of state
   */
  get state$(): Observable<DatatableState<T>> {
    return this._state$.asObservable();
  }

  /**
   * Observable stream of state changes
   */
  get stateChanges$(): Observable<StateChangeEvent<T> | null> {
    return this._stateChanges$.asObservable();
  }

  /**
   * Select a slice of state
   * Uses distinctUntilChanged for efficient change detection
   * 
   * @example
   * store.select(state => state.rows).subscribe(rows => ...)
   */
  select<K>(selector: (state: DatatableState<T>) => K): Observable<K> {
    return this._state$.pipe(
      map(selector),
      distinctUntilChanged()
    );
  }

  /**
   * Update state using a reducer function
   * Automatically freezes the new state for immutability
   * 
   * @example
   * store.update(state => ({ ...state, loading: true }));
   */
  update(
    updater: (state: DatatableState<T>) => DatatableState<T>,
    changeType?: StateChangeType
  ): void {
    const previousState = this._state$.value;
    const newState = updater(previousState);
    const frozenState = freezeState({
      ...newState,
      metadata: {
        ...newState.metadata,
        lastUpdate: new Date(),
        version: previousState.metadata.version + 1
      }
    });

    this._state$.next(frozenState);

    // Emit state change event
    if (changeType) {
      this._stateChanges$.next({
        type: changeType,
        previousState,
        currentState: frozenState,
        timestamp: new Date()
      });
    }
  }

  /**
   * Patch state (merge with current state)
   * Convenient for updating multiple properties
   * 
   * @example
   * store.patch({ loading: true, error: null });
   */
  patch(partial: Partial<DatatableState<T>>, changeType?: StateChangeType): void {
    this.update(state => ({ ...state, ...partial }), changeType);
  }

  /**
   * Reset state to initial values
   */
  reset(): void {
    const initialState = createInitialState<T>();
    this._state$.next(freezeState(initialState));
    this._stateChanges$.next(null);
  }

  /**
   * Get state snapshot as plain object (for debugging)
   */
  snapshot(): DatatableState<T> {
    return JSON.parse(JSON.stringify(this._state$.value));
  }
}

