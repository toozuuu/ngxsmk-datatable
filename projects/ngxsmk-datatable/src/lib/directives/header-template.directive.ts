import { Directive, Input, TemplateRef } from '@angular/core';
import { NgxsmkHeaderTemplateContext } from '../interfaces/column.interface';

/**
 * Directive for defining strongly-typed column header templates.
 * 
 * This directive provides type-safe context for custom header templates, allowing you
 * to create rich header content beyond simple text labels.
 * 
 * @template T - The type of your row data for full type safety
 * 
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 * 
 * @ViewChild('headerTemplate')
 * headerTemplate!: TemplateRef<NgxsmkHeaderTemplateContext<User>>;
 * ```
 * 
 * ```html
 * <ng-template #headerTemplate let-column="column">
 *   <!-- column is typed as NgxsmkColumn<User> -->
 *   <div class="custom-header">
 *     <strong>{{ column.name }}</strong>
 *     @if (column.sortable) {
 *       <i class="sort-icon"></i>
 *     }
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[ngxsmkHeaderTemplate]',
  standalone: true
})
export class HeaderTemplateDirective<T = any> {
  /** Column identifier for this header template */
  @Input() ngxsmkHeaderTemplate: string = '';

  constructor(public templateRef: TemplateRef<NgxsmkHeaderTemplateContext<T>>) {}

  /**
   * Type guard for Angular template type checking.
   * This enables proper type inference in templates.
   * @internal
   */
  static ngTemplateContextGuard<T>(
    dir: HeaderTemplateDirective<T>,
    ctx: unknown
  ): ctx is NgxsmkHeaderTemplateContext<T> {
    return true;
  }
}
