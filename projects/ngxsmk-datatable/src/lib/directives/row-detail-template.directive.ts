import { Directive, Input, TemplateRef } from '@angular/core';
import { NgxsmkRowDetailTemplateContext } from '../interfaces/column.interface';

/**
 * Directive for defining strongly-typed row detail expansion templates.
 * 
 * This directive provides type-safe context for row detail templates, allowing you
 * to create expandable row content with full TypeScript support.
 * 
 * @template T - The type of your row data for full type safety
 * 
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * }
 * 
 * @ViewChild('rowDetailTemplate')
 * rowDetailTemplate!: TemplateRef<NgxsmkRowDetailTemplateContext<User>>;
 * ```
 * 
 * ```html
 * <ng-template #rowDetailTemplate let-row="row" let-rowIndex="rowIndex">
 *   <!-- row is fully typed as NgxsmkRow<User> -->
 *   <div class="user-details">
 *     <h4>{{ row.name }}</h4>
 *     <p>Email: {{ row.email }}</p>
 *     <p>Address: {{ row.address.street }}, {{ row.address.city }}</p>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[ngxsmkRowDetailTemplate]',
  standalone: true
})
export class RowDetailTemplateDirective<T = any> {
  /** Identifier for this row detail template */
  @Input() ngxsmkRowDetailTemplate: string = '';

  constructor(public templateRef: TemplateRef<NgxsmkRowDetailTemplateContext<T>>) {}

  /**
   * Type guard for Angular template type checking.
   * This enables proper type inference in templates.
   * @internal
   */
  static ngTemplateContextGuard<T>(
    dir: RowDetailTemplateDirective<T>,
    ctx: unknown
  ): ctx is NgxsmkRowDetailTemplateContext<T> {
    return true;
  }
}
