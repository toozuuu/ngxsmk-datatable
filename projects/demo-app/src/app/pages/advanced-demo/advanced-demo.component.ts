import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatatableComponent, NgxsmkColumn, NgxsmkRow, PaginationConfig, RowDetailView } from 'ngxsmk-datatable';

@Component({
  selector: 'app-advanced-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatatableComponent],
  template: `
    <div class="demo-section">
    
      <h2 class="demo-header">
        <i class="fas fa-cogs"></i>
        Advanced Features Demo
      </h2>
      
      <div class="demo-content">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          This demo showcases advanced features including column pinning, row details, custom templates, and more.
        </div>

        <div class="demo-controls">
          <div class="form-group">
            <label class="form-label">Selection Type:</label>
            <select [(ngModel)]="selectionType" (change)="onSelectionTypeChange()" class="form-control">
              <option value="single">Single Row</option>
              <option value="multi">Multiple Rows</option>
              <option value="checkbox">Checkbox Selection</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Column Mode:</label>
            <select [(ngModel)]="columnMode" (change)="onColumnModeChange()" class="form-control">
              <option value="standard">Standard</option>
              <option value="flex">Flex</option>
              <option value="force">Force Fill</option>
            </select>
          </div>

          <div class="form-check">
            <input type="checkbox" id="rowDetails" [(ngModel)]="enableRowDetails" (change)="onRowDetailsToggle()" class="form-check-input">
            <label for="rowDetails" class="form-check-label">Enable Row Details</label>
          </div>

          <div class="form-check">
            <input type="checkbox" id="columnPinning" [(ngModel)]="enableColumnPinning" (change)="onColumnPinningToggle()" class="form-check-input">
            <label for="columnPinning" class="form-check-label">Enable Column Pinning</label>
          </div>

          <button class="btn btn-primary" (click)="toggleTheme()">
            <i class="fas fa-palette"></i>
            Toggle Theme ({{ isDarkTheme ? 'Dark' : 'Light' }})
          </button>
        </div>

        <div class="datatable-container" [class]="getTableClass()">
          <!-- Template definitions (must be outside @if) -->
          <ng-template #headerTemplate let-column="column">
              <div class="custom-header">
                <i [class]="getColumnIcon(column.id)"></i>
                {{ column.name }}
                @if (column.frozen) {
                  <span class="frozen-indicator">📌</span>
                }
              </div>
            </ng-template>

            <!-- Custom avatar cell template -->
            <ng-template #avatarTemplate let-row="row" let-value="value">
              <div class="user-avatar">
                <img [src]="value" [alt]="row['name']" class="avatar-image">
                <div class="user-info">
                  <div class="user-name">{{ row['name'] }}</div>
                  <div class="user-role">{{ row['role'] }}</div>
                </div>
              </div>
            </ng-template>

            <!-- Custom status cell template -->
            <ng-template #statusTemplate let-row="row" let-value="value">
              <div class="status-container">
                <span [class]="getStatusClass(value)">
                  <i [class]="getStatusIcon(value)"></i>
                  {{ value }}
                </span>
                <div class="status-indicator" [class]="getStatusIndicatorClass(value)"></div>
              </div>
            </ng-template>

            <!-- Custom progress cell template -->
            <ng-template #progressTemplate let-row="row" let-value="value">
              <div class="progress-container">
                <div class="progress-bar" [style.width.%]="value"></div>
                <span class="progress-text">{{ value }}%</span>
              </div>
            </ng-template>

            <!-- Custom actions cell template -->
            <ng-template #actionsTemplate let-row="row">
              <div class="action-buttons">
                <button class="btn btn-sm btn-primary" (click)="viewDetails(row)" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" (click)="editUser(row)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-warning" (click)="toggleStatus(row)" title="Toggle Status">
                  <i class="fas fa-toggle-on"></i>
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteUser(row)" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </ng-template>

            <!-- Row detail template - Redesigned with Modern UI -->
            <ng-template #rowDetailTemplate let-row="row" let-rowIndex="rowIndex">
              <div class="row-detail-wrapper">
                <!-- Profile Header Card -->
                <div class="detail-profile-header">
                  <div class="profile-avatar-section">
                    <img [src]="row['avatar']" [alt]="row['name']" class="detail-avatar">
                    <div class="profile-status-indicator" [class]="getStatusIndicatorClass(row['status'])"></div>
                  </div>
                  <div class="profile-info-section">
                    <h3 class="profile-name">{{ row['name'] }}</h3>
                    <p class="profile-email">
                      <i class="fas fa-envelope"></i>
                      {{ row['email'] }}
                    </p>
                    <div class="profile-badges">
                      <span class="role-badge" [class]="getRoleClass(row['role'])">
                        <i class="fas fa-user-shield"></i>
                        {{ row['role'] }}</span>
                      <span class="status-badge" [class]="getStatusClass(row['status'])">
                        <i [class]="getStatusIcon(row['status'])"></i>
                        {{ row['status'] }}
                      </span>
                    </div>
                  </div>
                  <div class="profile-id-section">
                    <span class="profile-id">ID: #{{ row['id'] }}</span>
                    <button class="btn-close-detail" (click)="closeDetail(row)" title="Close Details">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <!-- Stats Cards -->
                <div class="detail-stats-grid">
                  <div class="stat-card stat-card-blue">
                    <div class="stat-icon">
                      <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-label">Progress</div>
                      <div class="stat-value">{{ row['progress'] }}%</div>
                      <div class="stat-mini-progress">
                        <div class="stat-progress-bar" [style.width.%]="row['progress']"></div>
                      </div>
                    </div>
                  </div>

                  <div class="stat-card stat-card-green">
                    <div class="stat-icon">
                      <i class="fas fa-tasks"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-label">Tasks Completed</div>
                      <div class="stat-value">{{ Math.floor(row['progress'] * 2.4) }}</div>
                      <div class="stat-trend stat-trend-up">
                        <i class="fas fa-arrow-up"></i> 12%
                      </div>
                    </div>
                  </div>

                  <div class="stat-card stat-card-purple">
                    <div class="stat-icon">
                      <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-label">Last Login</div>
                      <div class="stat-value stat-value-small">{{ row['lastLogin'] }}</div>
                      <div class="stat-sub">{{ getDaysAgo(row['lastLogin']) }}</div>
                    </div>
                  </div>

                  <div class="stat-card stat-card-orange">
                    <div class="stat-icon">
                      <i class="fas fa-fire"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-label">Activity Score</div>
                      <div class="stat-value">{{ Math.floor(row['progress'] * 8.5) }}</div>
                      <div class="stat-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tabbed Content -->
                <div class="detail-tabs-container">
                  <div class="detail-tabs">
                    <button class="detail-tab detail-tab-active" data-tab="info">
                      <i class="fas fa-info-circle"></i>
                      Information
                    </button>
                    <button class="detail-tab" data-tab="activity">
                      <i class="fas fa-history"></i>
                      Activity
                    </button>
                    <button class="detail-tab" data-tab="settings">
                      <i class="fas fa-cog"></i>
                      Settings
                    </button>
                  </div>

                  <div class="detail-tab-content">
                    <!-- Info Tab -->
                    <div class="tab-pane tab-pane-active" data-pane="info">
                      <div class="info-cards-grid">
                        <div class="info-card">
                          <div class="info-card-header">
                            <i class="fas fa-user-circle"></i>
                            <h5>Personal Details</h5>
                          </div>
                          <div class="info-card-body">
                            <div class="info-row">
                              <span class="info-label">Full Name</span>
                              <span class="info-value">{{ row['name'] }}</span>
                            </div>
                            <div class="info-row">
                              <span class="info-label">Email Address</span>
                              <span class="info-value">{{ row['email'] }}</span>
                            </div>
                            <div class="info-row">
                              <span class="info-label">User ID</span>
                              <span class="info-value">#{{ row['id'] }}</span>
                            </div>
                            <div class="info-row">
                              <span class="info-label">Account Type</span>
                              <span class="info-value">{{ row['role'] }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="info-card">
                          <div class="info-card-header">
                            <i class="fas fa-shield-alt"></i>
                            <h5>Security & Access</h5>
                          </div>
                          <div class="info-card-body">
                            <div class="info-row">
                              <span class="info-label">Account Status</span>
                              <span class="info-value">
                                <span class="mini-badge" [class]="getStatusClass(row['status'])">
                                  {{ row['status'] }}
                                </span>
                              </span>
                            </div>
                            <div class="info-row">
                              <span class="info-label">2FA Enabled</span>
                              <span class="info-value">
                                <i class="fas fa-check-circle" style="color: #10b981;"></i> Yes
                              </span>
                            </div>
                            <div class="info-row">
                              <span class="info-label">Last Password Change</span>
                              <span class="info-value">30 days ago</span>
                            </div>
                            <div class="info-row">
                              <span class="info-label">Login Attempts</span>
                              <span class="info-value">0 failed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Activity Tab -->
                    <div class="tab-pane" data-pane="activity">
                      <div class="activity-timeline">
                        <div class="timeline-item">
                          <div class="timeline-marker timeline-marker-green">
                            <i class="fas fa-check"></i>
                          </div>
                          <div class="timeline-content">
                            <div class="timeline-header">
                              <h6>Profile Updated</h6>
                              <span class="timeline-time">2 hours ago</span>
                            </div>
                            <p>Updated email address and notification preferences</p>
                          </div>
                        </div>

                        <div class="timeline-item">
                          <div class="timeline-marker timeline-marker-blue">
                            <i class="fas fa-sign-in-alt"></i>
                          </div>
                          <div class="timeline-content">
                            <div class="timeline-header">
                              <h6>Login from New Device</h6>
                              <span class="timeline-time">{{ row['lastLogin'] }}</span>
                            </div>
                            <p>Logged in from Chrome on Windows • IP: 192.168.1.1</p>
                          </div>
                        </div>

                        <div class="timeline-item">
                          <div class="timeline-marker timeline-marker-purple">
                            <i class="fas fa-file-alt"></i>
                          </div>
                          <div class="timeline-content">
                            <div class="timeline-header">
                              <h6>Document Uploaded</h6>
                              <span class="timeline-time">1 day ago</span>
                            </div>
                            <p>Uploaded contract_2024.pdf (2.4 MB)</p>
                          </div>
                        </div>

                        <div class="timeline-item">
                          <div class="timeline-marker timeline-marker-orange">
                            <i class="fas fa-users"></i>
                          </div>
                          <div class="timeline-content">
                            <div class="timeline-header">
                              <h6>Team Collaboration</h6>
                              <span class="timeline-time">3 days ago</span>
                            </div>
                            <p>Invited to Project Alpha team workspace</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Settings Tab -->
                    <div class="tab-pane" data-pane="settings">
                      <div class="settings-grid">
                        <div class="setting-item">
                          <div class="setting-info">
                            <i class="fas fa-bell"></i>
                            <div>
                              <h6>Email Notifications</h6>
                              <p>Receive updates via email</p>
                            </div>
                          </div>
                          <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                          </label>
                        </div>

                        <div class="setting-item">
                          <div class="setting-info">
                            <i class="fas fa-lock"></i>
                            <div>
                              <h6>Two-Factor Authentication</h6>
                              <p>Enhanced security with 2FA</p>
                            </div>
                          </div>
                          <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                          </label>
                        </div>

                        <div class="setting-item">
                          <div class="setting-info">
                            <i class="fas fa-eye"></i>
                            <div>
                              <h6>Profile Visibility</h6>
                              <p>Show profile to team members</p>
                            </div>
                          </div>
                          <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="toggle-slider"></span>
                          </label>
                        </div>

                        <div class="setting-item">
                          <div class="setting-info">
                            <i class="fas fa-moon"></i>
                            <div>
                              <h6>Dark Mode</h6>
                              <p>Use dark theme preference</p>
                            </div>
                          </div>
                          <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="detail-actions-bar">
                  <button class="btn-action btn-primary-action" (click)="editUser(row)">
                    <i class="fas fa-edit"></i>
                    <span>Edit Profile</span>
                  </button>
                  <button class="btn-action btn-secondary-action" (click)="viewProfile(row)">
                    <i class="fas fa-user"></i>
                    <span>View Full Profile</span>
                  </button>
                  <button class="btn-action btn-success-action" (click)="sendMessage(row)">
                    <i class="fas fa-envelope"></i>
                    <span>Send Message</span>
                  </button>
                  <button class="btn-action btn-danger-action" (click)="deleteUser(row)">
                    <i class="fas fa-trash"></i>
                    <span>Delete User</span>
                  </button>
                </div>
              </div>
            </ng-template>

          @if (!templatesReady) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading templates...</p>
            </div>
          } @else if (loading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading data...</p>
            </div>
          } @else {
            <ngxsmk-datatable
              [columns]="getColumns()"
              [rows]="rows"
              [virtualScrolling]="true"
              [selectionType]="selectionType"
              [pagination]="paginationConfig"
              [externalPaging]="false"
              [externalSorting]="false"
              [rowDetail]="getRowDetailConfig()"
              (select)="onSelect($event)"
              (sort)="onSort($event)"
              (page)="onPage($event)"
              (rowDetailToggle)="onRowDetailToggle($event)"
              (columnResize)="onColumnResize($event)"
              (columnReorder)="onColumnReorder($event)">
            </ngxsmk-datatable>
          }
        </div>

        <!-- Event log -->
        <div class="card">
          <div class="card-header">
            <h4>Event Log</h4>
            <button class="btn btn-sm btn-secondary" (click)="clearEvents()">Clear</button>
          </div>
          <div class="card-body">
            <div class="event-log">
              @for (event of events.slice(-10); track event.time) {
                <div class="event-item">
                <span class="event-time">{{ event.time | date:'HH:mm:ss' }}</span>
                <span class="event-type">{{ event.type }}</span>
                <span class="event-message">{{ event.message }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .breadcrumb-item {
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .breadcrumb-item:hover:not(.active) {
      color: #3b82f6;
    }

    .breadcrumb-item.active {
      color: #1f2937;
      font-weight: 600;
    }

    .breadcrumb-separator {
      color: #d1d5db;
      font-weight: 400;
    }

    .demo-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-control {
      padding: 10px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .form-control:hover {
      border-color: #3b82f6;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-check {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
    }

    .form-check-input {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #3b82f6;
    }

    .form-check-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      user-select: none;
    }

    .datatable-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
      min-height: 600px;
    }

    .datatable-container ::ng-deep ngxsmk-datatable {
      height: 600px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 600px;
      gap: 20px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state p {
      font-size: 16px;
      color: #6b7280;
      font-weight: 500;
    }

    .custom-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .frozen-indicator {
      font-size: 12px;
      color: #2196f3;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
    }

    .user-role {
      font-size: 12px;
      color: #666;
    }

    .status-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-indicator-active {
      background: #28a745;
    }

    .status-indicator-inactive {
      background: #dc3545;
    }

    .status-indicator-pending {
      background: #ffc107;
    }

    .progress-container {
      position: relative;
      background: #f0f0f0;
      border-radius: 4px;
      height: 20px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      transition: width 0.3s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 11px;
      font-weight: 500;
      color: #333;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: nowrap;
    }

    .btn-sm {
      padding: 6px 10px;
      font-size: 13px;
      min-width: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .btn-sm:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .row-detail-content {
      padding: 30px;
      background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
      border-left: 4px solid #3b82f6;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e5e7eb;
    }

    .detail-header h4 {
      margin: 0;
      color: #1f2937;
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .detail-header h4::before {
      content: '📋';
      font-size: 24px;
    }

    .detail-id {
      font-size: 13px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-family: 'Courier New', monospace;
    }

    .detail-section {
      margin-bottom: 24px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .detail-section h5 {
      margin: 0 0 16px 0;
      color: #374151;
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
    }

    .detail-section h5::before {
      content: '';
      width: 4px;
      height: 16px;
      background: #3b82f6;
      border-radius: 2px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
      border-left: 3px solid #3b82f6;
    }

    .detail-item label {
      font-weight: 700;
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item span {
      font-size: 15px;
      color: #1f2937;
      font-weight: 500;
    }

    .role-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .role-admin {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: white;
    }

    .role-user {
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
      color: white;
    }

    .role-manager {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      color: white;
    }

    .role-guest {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      color: white;
    }

    .detail-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 2px solid #e5e7eb;
      flex-wrap: wrap;
    }

    .detail-actions .btn {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .detail-actions .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .status-active {
      color: #059669;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .status-active::before {
      content: '●';
      font-size: 14px;
      color: #10b981;
    }

    .status-inactive {
      color: #dc2626;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .status-inactive::before {
      content: '●';
      font-size: 14px;
      color: #ef4444;
    }

    .status-pending {
      color: #d97706;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .status-pending::before {
      content: '●';
      font-size: 14px;
      color: #f59e0b;
    }

    .event-log {
      max-height: 200px;
      overflow-y: auto;
    }

    .event-item {
      display: flex;
      gap: 10px;
      padding: 5px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .event-time {
      font-size: 12px;
      color: #666;
      min-width: 80px;
    }

    .event-type {
      font-weight: 500;
      min-width: 120px;
    }

    .event-message {
      color: #666;
    }

    .theme-dark {
      background: #1e1e1e;
      color: #ffffff;
      border-color: #404040;
    }

    .theme-dark.datatable-container {
      background: #1e1e1e;
      border-color: #404040;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable {
      background: #1e1e1e !important;
      border-color: #404040 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header {
      background: #2d2d2d !important;
      border-bottom-color: #404040 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell {
      background: #2d2d2d !important;
      color: #64b5f6 !important;
      border-right-color: #404040 !important;
      border-bottom-color: #404040 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell--frozen-left,
    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell--frozen-right {
      background: #2d2d2d !important;
      border-color: #404040 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell-content {
      color: #64b5f6 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell-text {
      color: #64b5f6 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell--checkbox {
      background: #2d2d2d !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell-sort-icon {
      color: #64b5f6 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell--sortable:hover {
      background: #3d3d3d !important;
      color: #82c7ff !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell--sorted {
      background: #3d3d3d !important;
      color: #82c7ff !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__header-cell--resizing {
      background: #4d4d4d !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__resize-handle:hover {
      background: rgba(100, 181, 246, 0.3) !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__body {
      background: #1e1e1e !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__row {
      background: #1e1e1e !important;
      border-bottom-color: #333 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__row:nth-child(even) {
      background: #252525 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__row:hover {
      background: #2d2d2d !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__cell {
      color: #e0e0e0 !important;
      border-bottom-color: #333 !important;
      border-right-color: #404040 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__cell--frozen-left,
    .theme-dark ::ng-deep .ngxsmk-datatable__cell--frozen-right {
      background: #1e1e1e !important;
      border-color: #404040 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__cell--checkbox {
      background: transparent !important;
    }

    .theme-dark ::ng-deep .ngxsmk-datatable__row:nth-child(even) .ngxsmk-datatable__cell--frozen-left,
    .theme-dark ::ng-deep .ngxsmk-datatable__row:nth-child(even) .ngxsmk-datatable__cell--frozen-right {
      background: #252525 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-pager {
      background: #2d2d2d !important;
      border-top-color: #404040 !important;
      color: #e0e0e0 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-pager__button {
      background: #3d3d3d !important;
      color: #e0e0e0 !important;
      border-color: #404040 !important;
    }

    .theme-dark ::ng-deep .ngxsmk-pager__button:hover:not(:disabled) {
      background: #4d4d4d !important;
    }

    .theme-dark ::ng-deep .ngxsmk-pager__button--active {
      background: #64b5f6 !important;
      color: #1e1e1e !important;
    }

    .theme-dark ::ng-deep .ngxsmk-pager__button:disabled {
      background: #2d2d2d !important;
      color: #666 !important;
    }

    /* ==========================================
       NEW MODERN ROW DETAIL STYLES
       ========================================== */
    
    /* Main Wrapper */
    .row-detail-wrapper {
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Profile Header */
    .detail-profile-header {
      background: white;
      padding: 30px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 24px;
      align-items: center;
      border-bottom: 3px solid #f3f4f6;
    }

    .profile-avatar-section {
      position: relative;
    }

    .detail-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      object-fit: cover;
    }

    .profile-status-indicator {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .profile-info-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .profile-name {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
    }

    .profile-email {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      font-size: 14px;
      margin: 0;
    }

    .profile-email i {
      color: #9ca3af;
    }

    .profile-badges {
      display: flex;
      gap: 10px;
      margin-top: 4px;
    }

    .status-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .profile-id-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }

    .profile-id {
      font-size: 13px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-family: 'Courier New', monospace;
    }

    .btn-close-detail {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: #fee2e2;
      color: #dc2626;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close-detail:hover {
      background: #dc2626;
      color: white;
      transform: rotate(90deg);
    }

    /* Stats Grid */
    .detail-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 16px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: currentColor;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .stat-card-blue { color: #3b82f6; }
    .stat-card-green { color: #10b981; }
    .stat-card-purple { color: #8b5cf6; }
    .stat-card-orange { color: #f59e0b; }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .stat-card-blue .stat-icon {
      background: #dbeafe;
      color: #3b82f6;
    }

    .stat-card-green .stat-icon {
      background: #d1fae5;
      color: #10b981;
    }

    .stat-card-purple .stat-icon {
      background: #ede9fe;
      color: #8b5cf6;
    }

    .stat-card-orange .stat-icon {
      background: #fef3c7;
      color: #f59e0b;
    }

    .stat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    .stat-value-small {
      font-size: 16px;
    }

    .stat-sub {
      font-size: 11px;
      color: #9ca3af;
    }

    .stat-mini-progress {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 4px;
    }

    .stat-progress-bar {
      height: 100%;
      background: currentColor;
      transition: width 0.5s ease;
    }

    .stat-trend {
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .stat-trend-up {
      color: #10b981;
    }

    .stat-rating {
      display: flex;
      gap: 2px;
      font-size: 12px;
      color: #fbbf24;
    }

    /* Tabs */
    .detail-tabs-container {
      background: white;
      margin: 0 20px 20px 20px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .detail-tabs {
      display: flex;
      border-bottom: 2px solid #f3f4f6;
      background: #fafafa;
    }

    .detail-tab {
      flex: 1;
      padding: 16px 24px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
    }

    .detail-tab:hover {
      color: #3b82f6;
      background: white;
    }

    .detail-tab-active {
      color: #3b82f6;
      background: white;
    }

    .detail-tab-active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: #3b82f6;
    }

    .detail-tab-content {
      padding: 24px;
    }

    .tab-pane {
      display: none;
    }

    .tab-pane-active {
      display: block;
    }

    /* Info Cards */
    .info-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .info-card-header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-card-header i {
      font-size: 18px;
    }

    .info-card-header h5 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
    }

    .info-card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #3b82f6;
    }

    .info-label {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
    }

    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .mini-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
    }

    /* Timeline */
    .activity-timeline {
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: relative;
      padding-left: 40px;
    }

    .activity-timeline::before {
      content: '';
      position: absolute;
      left: 17px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(to bottom, #3b82f6, #dbeafe);
    }

    .timeline-item {
      position: relative;
      display: flex;
      gap: 16px;
    }

    .timeline-marker {
      position: absolute;
      left: -40px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1;
    }

    .timeline-marker-green { background: linear-gradient(135deg, #10b981, #059669); }
    .timeline-marker-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .timeline-marker-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
    .timeline-marker-orange { background: linear-gradient(135deg, #f59e0b, #d97706); }

    .timeline-content {
      flex: 1;
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      border-left: 3px solid #e5e7eb;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .timeline-header h6 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #1f2937;
    }

    .timeline-time {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }

    .timeline-content p {
      margin: 0;
      font-size: 13px;
      color: #6b7280;
      line-height: 1.5;
    }

    /* Settings */
    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      transition: all 0.2s;
    }

    .setting-item:hover {
      background: white;
      border-color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
    }

    .setting-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .setting-info i {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: #dbeafe;
      color: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .setting-info h6 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 700;
      color: #1f2937;
    }

    .setting-info p {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    /* Toggle Switch */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 52px;
      height: 28px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #cbd5e1;
      transition: 0.3s;
      border-radius: 28px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch input:checked + .toggle-slider {
      background-color: #3b82f6;
    }

    .toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(24px);
    }

    /* Action Buttons */
    .detail-actions-bar {
      display: flex;
      gap: 12px;
      padding: 20px;
      background: white;
      border-top: 2px solid #f3f4f6;
      flex-wrap: wrap;
    }

    .btn-action {
      flex: 1;
      min-width: 140px;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-action:active {
      transform: translateY(0);
    }

    .btn-primary-action {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
    }

    .btn-primary-action:hover {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
    }

    .btn-secondary-action {
      background: linear-gradient(135deg, #6b7280, #4b5563);
      color: white;
    }

    .btn-secondary-action:hover {
      background: linear-gradient(135deg, #4b5563, #374151);
    }

    .btn-success-action {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .btn-success-action:hover {
      background: linear-gradient(135deg, #059669, #047857);
    }

    .btn-danger-action {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .btn-danger-action:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
    }

    @media (max-width: 768px) {
      .detail-profile-header {
        grid-template-columns: auto 1fr;
      }

      .profile-id-section {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: space-between;
      }

      .detail-stats-grid {
        grid-template-columns: 1fr;
      }

      .info-cards-grid {
        grid-template-columns: 1fr;
      }

      .detail-tabs {
        flex-wrap: wrap;
      }

      .detail-tab {
        flex: 1 1 auto;
        min-width: 100px;
      }

      .detail-actions-bar {
        flex-direction: column;
      }

      .btn-action {
        width: 100%;
      }
    }
  `]
})
export class AdvancedDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('avatarTemplate') avatarTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('progressTemplate') progressTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('rowDetailTemplate') rowDetailTemplate!: TemplateRef<any>;

  columns: NgxsmkColumn[] = [];
  rows: NgxsmkRow[] = [];
  selectedRows: NgxsmkRow[] = [];
  loading = false;
  templatesReady = false;

  selectionType: 'single' | 'multi' | 'checkbox' = 'checkbox';
  columnMode: 'standard' | 'flex' | 'force' = 'standard';
  enableRowDetails = true;
  enableColumnPinning = true;
  isDarkTheme = false;

  paginationConfig: PaginationConfig = {
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    showPageSizeOptions: true,
    showFirstLastButtons: true,
    showRangeLabels: true,
    showTotalItems: true,
    totalItems: 0,
    currentPage: 1,
    maxSize: 5
  };

  events: Array<{ time: Date, type: string, message: string }> = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Data will be loaded after templates are ready
  }

  ngAfterViewInit() {
    this.initializeColumns();
    this.loadData();
    this.templatesReady = true;
    this.cdr.detectChanges();
  }

  private initializeColumns() {
    this.columns = [
      {
        id: 'avatar',
        name: 'User',
        prop: 'avatar',
        width: 250,
        cellTemplate: this.avatarTemplate,
        sortable: false,
        frozen: this.enableColumnPinning ? 'left' : false
      },
      {
        id: 'email',
        name: 'Email',
        prop: 'email',
        width: 250,
        sortable: true
      },
      {
        id: 'role',
        name: 'Role',
        prop: 'role',
        width: 120,
        sortable: true
      },
      {
        id: 'status',
        name: 'Status',
        prop: 'status',
        width: 120,
        cellTemplate: this.statusTemplate,
        sortable: true
      },
      {
        id: 'progress',
        name: 'Progress',
        prop: 'progress',
        width: 150,
        cellTemplate: this.progressTemplate,
        sortable: true
      },
      {
        id: 'lastLogin',
        name: 'Last Login',
        prop: 'lastLogin',
        width: 150,
        sortable: true
      },
      {
        id: 'actions',
        name: 'Actions',
        prop: 'actions',
        width: 200,
        cellTemplate: this.actionsTemplate,
        sortable: false,
        frozen: this.enableColumnPinning ? 'right' : false
      }
    ];
  }

  getColumns(): NgxsmkColumn[] {
    return this.columns.map(col => ({
      ...col,
      frozen: this.enableColumnPinning ? col.frozen : false
    }));
  }

  getRowDetailConfig(): RowDetailView | null {
    if (!this.enableRowDetails) return null;

    return {
      template: this.rowDetailTemplate,
      rowHeight: 450, // Increased height for new modern design
      toggleOnClick: true,
      expandOnInit: false
    };
  }

  getTableClass(): string {
    return this.isDarkTheme ? 'theme-dark' : '';
  }

  getColumnIcon(columnId: string): string {
    const icons = {
      'avatar': 'fas fa-user',
      'email': 'fas fa-envelope',
      'role': 'fas fa-user-tag',
      'status': 'fas fa-circle',
      'progress': 'fas fa-chart-line',
      'lastLogin': 'fas fa-clock',
      'actions': 'fas fa-cogs'
    };
    return icons[columnId as keyof typeof icons] || 'fas fa-columns';
  }

  loadData() {
    this.loading = true;
    this.logEvent('Data Loading', 'Loading advanced demo data...');

    setTimeout(() => {
      this.rows = this.generateMockData(100);
      this.paginationConfig.totalItems = this.rows.length;
      this.loading = false;
      this.logEvent('Data Loaded', `${this.rows.length} users loaded`);
    }, 1000);
  }

  onSelect(event: any) {
    this.selectedRows = event.selected;
    this.logEvent('Selection Changed', `${event.selected.length} rows selected`);
  }

  onSort(event: any) {
    this.logEvent('Sort Changed', `Sorting by ${event.column.name} (${event.newValue})`);
  }

  onPage(event: any) {
    this.logEvent('Page Changed', `Page ${event.page}`);
  }

  onRowDetailToggle(event: any) {
    this.logEvent('Row Detail Toggle', `Row ${event.rowIndex} ${event.expanded ? 'expanded' : 'collapsed'}`);
  }

  onColumnResize(event: any) {
    this.logEvent('Column Resized', `Column ${event.column.name} resized to ${event.newWidth}px`);
  }

  onColumnReorder(event: any) {
    this.logEvent('Column Reordered', `Column ${event.column.name} moved to position ${event.newIndex}`);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStatusIcon(status: string): string {
    const icons = {
      'Active': 'fas fa-check-circle',
      'Inactive': 'fas fa-times-circle',
      'Pending': 'fas fa-clock'
    };
    return icons[status as keyof typeof icons] || 'fas fa-question';
  }

  getStatusIndicatorClass(status: string): string {
    return `status-indicator-${status.toLowerCase()}`;
  }

  getRoleClass(role: string): string {
    return `role-${role.toLowerCase()}`;
  }

  viewDetails(row: NgxsmkRow) {
    this.logEvent('View Details', `Viewing details for ${row['name']}`);
  }

  editUser(row: NgxsmkRow) {
    this.logEvent('Edit User', `Editing user: ${row['name']}`);
  }

  toggleStatus(row: NgxsmkRow) {
    row['status'] = row['status'] === 'Active' ? 'Inactive' : 'Active';
    this.logEvent('Status Toggled', `${row['name']} status changed to ${row['status']}`);
  }

  deleteUser(row: NgxsmkRow) {
    this.logEvent('Delete User', `Deleting user: ${row['name']}`);
  }

  viewProfile(row: NgxsmkRow) {
    this.logEvent('View Profile', `Viewing profile for ${row['name']}`);
  }

  sendMessage(row: NgxsmkRow) {
    this.logEvent('Send Message', `Sending message to ${row['name']}`);
  }

  onSelectionTypeChange() {
    this.logEvent('Selection Type Changed', `Selection type: ${this.selectionType}`);
    this.selectedRows = [];
    this.cdr.detectChanges();
  }

  onColumnModeChange() {
    this.logEvent('Column Mode Changed', `Column mode: ${this.columnMode}`);
    this.cdr.detectChanges();
  }

  onRowDetailsToggle() {
    this.logEvent('Row Details Toggle', `Row details ${this.enableRowDetails ? 'enabled' : 'disabled'}`);
    this.cdr.detectChanges();
  }

  onColumnPinningToggle() {
    this.logEvent('Column Pinning Toggle', `Column pinning ${this.enableColumnPinning ? 'enabled' : 'disabled'}`);
    this.initializeColumns();
    this.cdr.detectChanges();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.logEvent('Theme Toggled', `Switched to ${this.isDarkTheme ? 'dark' : 'light'} theme`);
    this.cdr.detectChanges();
  }

  clearEvents() {
    this.events = [];
  }

  // Helper method for template - calculate days ago
  getDaysAgo(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Recently';
    }
  }

  // Close detail row
  closeDetail(row: NgxsmkRow) {
    // Toggle row detail closed
    row['$$expanded'] = false;
    this.logEvent('Row Detail Closed', `Closed details for ${row['name']}`);
    this.cdr.detectChanges();
  }

  // Expose Math to template
  Math = Math;

  private generateMockData(count: number): NgxsmkRow[] {
    const roles = ['Admin', 'User', 'Manager', 'Guest'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    const data = [];

    for (let i = 1; i <= count; i++) {
      data.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        progress: Math.floor(Math.random() * 100),
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }

    return data;
  }

  private logEvent(type: string, message: string) {
    this.events.push({
      time: new Date(),
      type,
      message
    });
  }
}
