import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxsmkRowDetailTemplate]',
  standalone: true
})
export class RowDetailTemplateDirective {
  @Input() ngxsmkRowDetailTemplate: string = '';

  constructor(public templateRef: TemplateRef<any>) {}
}
