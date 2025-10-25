import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxsmkHeaderTemplate]',
  standalone: true
})
export class HeaderTemplateDirective {
  @Input() ngxsmkHeaderTemplate: string = '';

  constructor(public templateRef: TemplateRef<any>) {}
}
