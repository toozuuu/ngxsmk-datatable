import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { NgxsmkDatatableComponent } from './components/ngxsmk-datatable/ngxsmk-datatable.component';
import { NgxsmkPagerComponent } from './components/ngxsmk-pager/ngxsmk-pager.component';

// Directives
import { ColumnTemplateDirective } from './directives/column-template.directive';
import { HeaderTemplateDirective } from './directives/header-template.directive';
import { RowDetailTemplateDirective } from './directives/row-detail-template.directive';

// Pipes
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

// Services
import { VirtualScrollService } from './services/virtual-scroll.service';
import { ColumnResizeService } from './services/column-resize.service';
import { SelectionService } from './services/selection.service';

@NgModule({
  imports: [
    NgxsmkDatatableComponent,
    NgxsmkPagerComponent,
    ColumnTemplateDirective,
    HeaderTemplateDirective,
    RowDetailTemplateDirective,
    SafeHtmlPipe
  ],
  exports: [
    NgxsmkDatatableComponent,
    NgxsmkPagerComponent,
    ColumnTemplateDirective,
    HeaderTemplateDirective,
    RowDetailTemplateDirective,
    SafeHtmlPipe
  ]
})
export class NgxsmkDatatableModule {}
