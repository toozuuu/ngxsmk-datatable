import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any): SafeHtml | null {
    if (value == null) {
      return null;
    }

    const stringValue = String(value);
    return this.sanitizer.sanitize(SecurityContext.HTML, stringValue) as SafeHtml;
  }
}