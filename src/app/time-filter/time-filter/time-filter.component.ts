import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import type { ECharts, EChartsCoreOption } from 'echarts/core';
import dayjs from 'dayjs';

@Component({
  selector: 'app-time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.css'],
  standalone: false
})
export class TimeFilterComponent implements OnInit {
  @Input() data: { date: string; value: number }[] = [];
  @Input() startDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 1));
  @Input() endDate: Date = new Date();
  @Output() dateRangeChanged = new EventEmitter<{ start: Date; end: Date }>();

  chartOption: EChartsCoreOption = {};
  echartsInstance: ECharts | null = null;

  ngOnInit(): void {
    if (!this.data || this.data.length === 0) {
      this.generateDemoData();
    }
    this.initChart();
  }

  onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;
  
    ec.on('dataZoom', (event: any) => {
      this.handleZoomEvent(event);
    });
  }
  private initChart(): void {
    const dates = this.data.map(item => item.date);
    const values = this.data.map(item => item.value);

    const startIndex = this.findClosestDateIndex(this.startDate);
    const endIndex = this.findClosestDateIndex(this.endDate);

    this.chartOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('DD/MM/YYYY')
        }
      },
      yAxis: {
        type: 'value',
        scale: true
      },
      series: [
        {
          type: 'line',
          data: values,
          smooth: true,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.2 }
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: (startIndex / dates.length) * 100,
          end: (endIndex / dates.length) * 100
        },
        {
          type: 'inside',
          xAxisIndex: 0
        }
      ]
    };
  }

  private findClosestDateIndex(target: Date): number {
    const targetStr = dayjs(target).format('YYYY-MM-DD');
    return this.data.findIndex(item => item.date === targetStr) || 0;
  }

  private generateDemoData(): void {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);

    this.data = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      this.data.push({
        date: dayjs(d).format('YYYY-MM-DD'),
        value: Math.floor(Math.random() * 1000) + 500
      });
    }
  }

  private handleZoomEvent(event: any): void {
    if (!this.data || this.data.length === 0) return;
  
    const startPercentage = event?.start ?? event?.batch?.[0]?.start;
    const endPercentage = event?.end ?? event?.batch?.[0]?.end;
  
    if (startPercentage === undefined || endPercentage === undefined) return;
  
    const startIndex = Math.floor((startPercentage / 100) * this.data.length);
    const endIndex = Math.floor((endPercentage / 100) * this.data.length);
  
    const startDate = new Date(this.data[startIndex]?.date);
    const endDate = new Date(this.data[endIndex]?.date);
  
    this.dateRangeChanged.emit({ start: startDate, end: endDate });
  }
  
  
}
