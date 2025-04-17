import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TimeDataService } from './services/time-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  timeData: { index: number; date: string; value: number }[] = [];

  defaultStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  defaultEndDate = new Date();

  selectedRange: { start: Date; end: Date } | null = null;

  constructor(
    private timeDataService: TimeDataService,

    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const rawData = this.timeDataService.generateDemoData();
    this.timeData = rawData
  }

  onDateRangeChanged(range: { start: Date; end: Date }) {
    this.selectedRange = range;
    console.log('✅ Nuovo intervallo selezionato:', range);

    this.cdr.detectChanges();
  }
}
