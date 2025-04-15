import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TimeDataService } from './services/time-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  timeData: { date: string; value: number }[] = [];
  defaultStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  defaultEndDate = new Date();
  selectedRange = {
    start: this.defaultStartDate,
    end: this.defaultEndDate
  };

  constructor(
    private timeDataService: TimeDataService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.timeData = this.timeDataService.generateDemoData(); // restituisce array
  }

  onDateRangeChanged(range: { start: Date; end: Date }): void {
    this.selectedRange = range;
    this.cdr.detectChanges();
  }
}
