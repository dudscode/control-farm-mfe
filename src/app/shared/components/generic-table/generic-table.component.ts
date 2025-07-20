import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

export interface ColumnConfig {
  label: string;
  format?: 'text' | 'date' | 'currency' | 'number';
}

export type ColumnsConfig = {
  [key: string]: string | ColumnConfig;
};

@Component({
    selector: 'app-generic-table',
  imports: [
    CommonModule,
    FormsModule, // Add this import to the imports array
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: any = {};
  @Input() showFilters: boolean = true;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  selectedMonth: string = '';
  availableMonths = [
    { value: '0', label: 'Janeiro' },
    { value: '1', label: 'Fevereiro' },
    { value: '2', label: 'Março' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Maio' },
    { value: '5', label: 'Junho' },
    { value: '6', label: 'Julho' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Setembro' },
    { value: '9', label: 'Outubro' },
    { value: '10', label: 'Novembro' },
    { value: '11', label: 'Dezembro' },
  ];
  private originalData: any[] = [];  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.displayedColumns = Object.keys(this.columns);    
    this.originalData = [...this.data];
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
            this.originalData = [...this.data];
      this.updateDataSource();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.setupCustomSorting();
  }

    applyMonthFilter(): void {
    if (!this.selectedMonth) {
      // If no month selected, show all data
      this.dataSource.data = this.originalData;
    } else {
      // Find the date column
      const dateColumn = this.findDateColumn();
      
      if (dateColumn) {
        // Filter data by month
        this.dataSource.data = this.originalData.filter(item => {
          const date = new Date(item[dateColumn]);
          return date.getMonth().toString() === this.selectedMonth;
        });
      }
    }
    
    // Reset paginator after filtering
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

   private findDateColumn(): string | null {
    for (const key of Object.keys(this.columns)) {
      const column = this.columns[key];
      if (typeof column !== 'string' && column.format === 'date') {
        return key;
      }
    }
    return null;
  }

  updateDataSource(): void {
    this.dataSource.data = this.data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  setupCustomSorting(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      const value = item[property];

      // Handle different column formats for sorting
      switch (this.getColumnFormat(property)) {
        case 'date':
          return new Date(value).getTime();
        case 'currency':
        case 'number':
          return typeof value === 'number' ? value : parseFloat(value);
        default:
          return value;
      }
    };
  }

  getColumnLabel(columnName: string): string {
    const column = this.columns[columnName];
    if (typeof column === 'string') {
      return column;
    }
    return column.label;
  }

  getColumnFormat(columnName: string): string {
    const column = this.columns[columnName];
    if (typeof column === 'string') {
      return 'text';
    }
    return column.format || 'text';
  }
  
  getClassStatus(status: string): string {
    switch (status) {
      case 'Em Progresso':
        return 'status-in-progress';
      case 'Concluído':
        return 'status-completed';
      default:
        return '';
    }
  }
}
