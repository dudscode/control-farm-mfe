import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ColumnConfig {
  label: string;
  format?: 'text' | 'date' | 'currency' | 'number';
}

export type ColumnsConfig = {
  [key: string]: string | ColumnConfig;
};

@Component({
  selector: 'app-generic-table',
  imports: [CommonModule,
    CommonModule,
    FormsModule, // Add this import to the imports array
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent {
  @Input() data: any[] = [];
  @Input() columns: ColumnsConfig = {};
  get displayedColumns(): string[] {
    return Object.keys(this.columns);
  }

    getColumnLabel(columnName: string): string {
    const column = this.columns[columnName];
    if (typeof column === 'string') {
      return column;
    }
    return column.label;
  }

    // Get column format type, with 'text' as default
  getColumnFormat(columnName: string): string {
    const column = this.columns[columnName];
    if (typeof column === 'string') {
      return 'text';
    }
    return column.format || 'text';
  }
}
