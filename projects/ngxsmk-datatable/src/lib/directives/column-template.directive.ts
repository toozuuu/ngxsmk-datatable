import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxsmkColumnTemplate]',
  standalone: true
})
export class ColumnTemplateDirective {
  @Input() ngxsmkColumnTemplate: string = '';

  constructor(public templateRef: TemplateRef<any>) {}
}
