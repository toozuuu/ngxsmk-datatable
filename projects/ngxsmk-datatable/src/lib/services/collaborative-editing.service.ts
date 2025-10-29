import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import {
  CollaborativeEditingConfig,
  CollaborativeOperation,
  CollaborativeUser,
  CollaborativeSession,
  CollaborativeMessage,
  CollaborativeConflict,
  CollaborativeCursor,
  CollaborativeSelection
} from '../interfaces/collaborative-editing.interface';

/**
 * Collaborative Editing Service
 * Enables real-time multi-user editing with WebSocket support
 */
@Injectable({
  providedIn: 'root'
})
export class CollaborativeEditingService implements OnDestroy {
  private websocket: WebSocket | null = null;
  private config: CollaborativeEditingConfig | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimer: any;
  private presenceTimer?: Subscription;

  // State
  private sessionSubject = new BehaviorSubject<CollaborativeSession | null>(null);
  private activeUsersSubject = new BehaviorSubject<CollaborativeUser[]>([]);
  private operationsSubject = new Subject<CollaborativeOperation>();
  private conflictsSubject = new Subject<CollaborativeConflict>();
  private connectionStatusSubject = new BehaviorSubject<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');

  // Public observables
  readonly session$ = this.sessionSubject.asObservable();
  readonly activeUsers$ = this.activeUsersSubject.asObservable();
  readonly operations$ = this.operationsSubject.asObservable();
  readonly conflicts$ = this.conflictsSubject.asObservable();
  readonly connectionStatus$ = this.connectionStatusSubject.asObservable();

  private operations: CollaborativeOperation[] = [];
  private currentVersion = 0;

  constructor() {}

  /**
   * Initialize collaborative editing
   */
  async initialize(config: CollaborativeEditingConfig): Promise<void> {
    this.config = config;

    if (!config.enabled || !config.websocketUrl) {
      return;
    }

    // Authenticate if needed
    if (config.authenticate) {
      const token = await config.authenticate();
      if (!token) {
        throw new Error('Authentication failed');
      }
    }

    this.connect();

    // Start presence broadcasting
    if (config.broadcastPresence) {
      this.startPresenceBroadcast();
    }
  }

  /**
   * Connect to WebSocket server
   */
  private connect(): void {
    if (!this.config?.websocketUrl) return;

    this.connectionStatusSubject.next('connecting');

    try {
      const url = new URL(this.config.websocketUrl);
      if (this.config.roomId) {
        url.searchParams.set('room', this.config.roomId);
      }
      url.searchParams.set('userId', this.config.userId);

      this.websocket = new WebSocket(url.toString());

      this.websocket.onopen = () => this.handleOpen();
      this.websocket.onmessage = (event) => this.handleMessage(event);
      this.websocket.onerror = (error) => this.handleError(error);
      this.websocket.onclose = () => this.handleClose();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.connectionStatusSubject.next('error');
      this.attemptReconnect();
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.presenceTimer?.unsubscribe();
    this.connectionStatusSubject.next('disconnected');
  }

  /**
   * Broadcast operation to other users
   */
  broadcastOperation(operation: CollaborativeOperation): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected');
      return;
    }

    operation.version = this.currentVersion++;
    this.operations.push(operation);

    const message: CollaborativeMessage = {
      type: 'operation',
      payload: operation,
      userId: this.config!.userId,
      timestamp: Date.now()
    };

    this.websocket.send(JSON.stringify(message));
  }

  /**
   * Update cursor position
   */
  updateCursor(cursor: CollaborativeCursor): void {
    if (!this.config?.showCursors) return;

    const message: CollaborativeMessage = {
      type: 'cursor',
      payload: cursor,
      userId: this.config.userId,
      timestamp: Date.now()
    };

    this.sendMessage(message);
  }

  /**
   * Update selection
   */
  updateSelection(selection: CollaborativeSelection): void {
    if (!this.config?.showSelections) return;

    const message: CollaborativeMessage = {
      type: 'selection',
      payload: selection,
      userId: this.config.userId,
      timestamp: Date.now()
    };

    this.sendMessage(message);
  }

  /**
   * Request sync
   */
  requestSync(): void {
    const message: CollaborativeMessage = {
      type: 'sync',
      payload: { version: this.currentVersion },
      userId: this.config!.userId,
      timestamp: Date.now()
    };

    this.sendMessage(message);
  }

  /**
   * Get active users
   */
  getActiveUsers(): CollaborativeUser[] {
    return this.activeUsersSubject.value;
  }

  /**
   * Get current session
   */
  getSession(): CollaborativeSession | null {
    return this.sessionSubject.value;
  }

  /**
   * Handle WebSocket open
   */
  private handleOpen(): void {
    console.log('WebSocket connected');
    this.connectionStatusSubject.next('connected');
    this.reconnectAttempts = 0;

    // Join room
    const joinMessage: CollaborativeMessage = {
      type: 'join',
      payload: {
        userId: this.config!.userId,
        userName: this.config!.userName,
        userAvatar: this.config!.userAvatar,
        userColor: this.config!.userColor || this.generateUserColor()
      },
      userId: this.config!.userId,
      timestamp: Date.now()
    };

    this.sendMessage(joinMessage);
  }

  /**
   * Handle WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: CollaborativeMessage = JSON.parse(event.data);

      switch (message.type) {
        case 'operation':
          this.handleOperationMessage(message);
          break;
        case 'presence':
          this.handlePresenceMessage(message);
          break;
        case 'cursor':
          this.handleCursorMessage(message);
          break;
        case 'selection':
          this.handleSelectionMessage(message);
          break;
        case 'join':
          this.handleJoinMessage(message);
          break;
        case 'leave':
          this.handleLeaveMessage(message);
          break;
        case 'sync':
          this.handleSyncMessage(message);
          break;
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Handle operation message
   */
  private handleOperationMessage(message: CollaborativeMessage): void {
    const operation: CollaborativeOperation = message.payload;

    // Check for conflicts
    if (this.config?.conflictResolution === 'operational-transform') {
      this.applyOperationalTransform(operation);
    }

    this.operationsSubject.next(operation);
  }

  /**
   * Handle presence message
   */
  private handlePresenceMessage(message: CollaborativeMessage): void {
    const users: CollaborativeUser[] = message.payload;
    this.activeUsersSubject.next(users);
  }

  /**
   * Handle cursor message
   */
  private handleCursorMessage(message: CollaborativeMessage): void {
    const users = this.activeUsersSubject.value;
    const userIndex = users.findIndex(u => u.id === message.userId);
    
    if (userIndex !== -1) {
      users[userIndex].cursor = message.payload;
      this.activeUsersSubject.next([...users]);
    }
  }

  /**
   * Handle selection message
   */
  private handleSelectionMessage(message: CollaborativeMessage): void {
    const users = this.activeUsersSubject.value;
    const userIndex = users.findIndex(u => u.id === message.userId);
    
    if (userIndex !== -1) {
      users[userIndex].selection = message.payload;
      this.activeUsersSubject.next([...users]);
    }
  }

  /**
   * Handle join message
   */
  private handleJoinMessage(message: CollaborativeMessage): void {
    const user: CollaborativeUser = {
      ...message.payload,
      lastActivity: message.timestamp,
      online: true
    };

    const users = this.activeUsersSubject.value;
    if (!users.find(u => u.id === user.id)) {
      this.activeUsersSubject.next([...users, user]);
    }
  }

  /**
   * Handle leave message
   */
  private handleLeaveMessage(message: CollaborativeMessage): void {
    const users = this.activeUsersSubject.value;
    this.activeUsersSubject.next(users.filter(u => u.id !== message.userId));
  }

  /**
   * Handle sync message
   */
  private handleSyncMessage(message: CollaborativeMessage): void {
    const { version, operations } = message.payload;
    
    if (operations) {
      // Apply missed operations
      operations.forEach((op: CollaborativeOperation) => {
        this.operationsSubject.next(op);
      });
    }
    
    this.currentVersion = version;
  }

  /**
   * Handle WebSocket error
   */
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.connectionStatusSubject.next('error');
  }

  /**
   * Handle WebSocket close
   */
  private handleClose(): void {
    console.log('WebSocket disconnected');
    this.connectionStatusSubject.next('disconnected');

    if (this.config?.autoReconnect) {
      this.attemptReconnect();
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = (this.config?.reconnectInterval || 3000) * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Send message to WebSocket
   */
  private sendMessage(message: CollaborativeMessage): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    }
  }

  /**
   * Start presence broadcast
   */
  private startPresenceBroadcast(): void {
    const interval_duration = this.config?.presenceInterval || 30000;

    this.presenceTimer = interval(interval_duration).subscribe(() => {
      const message: CollaborativeMessage = {
        type: 'presence',
        payload: {
          userId: this.config!.userId,
          lastActivity: Date.now()
        },
        userId: this.config!.userId,
        timestamp: Date.now()
      };

      this.sendMessage(message);
    });
  }

  /**
   * Apply operational transformation
   */
  private applyOperationalTransform(operation: CollaborativeOperation): void {
    // Simple OT implementation
    // In production, use a library like ot.js or ShareDB
    const pendingOps = this.operations.filter(op => op.version! >= operation.version!);

    for (const localOp of pendingOps) {
      // Transform operations
      // This is simplified - real OT is more complex
      if (this.operationsConflict(localOp, operation)) {
        const conflict: CollaborativeConflict = {
          localOperation: localOp,
          remoteOperation: operation,
          type: 'edit-edit',
          resolution: this.config?.conflictResolution === 'last-write-wins' ? 'accepted' : 'rejected'
        };

        this.conflictsSubject.next(conflict);
      }
    }
  }

  /**
   * Check if operations conflict
   */
  private operationsConflict(op1: CollaborativeOperation, op2: CollaborativeOperation): boolean {
    return op1.rowIndex === op2.rowIndex && 
           op1.columnField === op2.columnField &&
           op1.timestamp !== op2.timestamp;
  }

  /**
   * Generate random user color
   */
  private generateUserColor(): string {
    const colors = [
      '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', 
      '#9B59B6', '#1ABC9C', '#E67E22', '#34495E'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}

