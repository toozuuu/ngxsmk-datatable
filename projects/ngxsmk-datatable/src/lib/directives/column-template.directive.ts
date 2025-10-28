import { Directive, Input, TemplateRef } from '@angular/core';
import { NgxsmkCellTemplateContext } from '../interfaces/column.interface';

/**
 * Directive for defining strongly-typed column cell templates.
 * 
 * This directive provides type-safe context for cell templates, ensuring that
 * the `row` and `value` variables are properly typed based on your data model.
 * 
 * @template T - The type of your row data for full type safety
 * 
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   status: 'Active' | 'Inactive';
 * }
 * 
 * @ViewChild('statusTemplate')
 * statusTemplate!: TemplateRef<NgxsmkCellTemplateContext<User, User['status']>>;
 * ```
 * 
 * ```html
 * <ng-template #statusTemplate let-row="row" let-value="value">
 *   <!-- row is typed as NgxsmkRow<User> -->
 *   <!-- value is typed as 'Active' | 'Inactive' -->
 *   <span [class]="'status-' + value.toLowerCase()">
 *     {{ value }}
 *   </span>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[ngxsmkColumnTemplate]',
  standalone: true
})
export class ColumnTemplateDirective<T = any> {
  /** Column identifier for this template */
  @Input() ngxsmkColumnTemplate: string = '';

  constructor(public templateRef: TemplateRef<NgxsmkCellTemplateContext<T>>) {}

  /**
   * Type guard for Angular template type checking.
   * This enables proper type inference in templates.
   * @internal
   */
  static ngTemplateContextGuard<T>(
    dir: ColumnTemplateDirective<T>,
    ctx: unknown
  ): ctx is NgxsmkCellTemplateContext<T> {
    return true;
  }
}
