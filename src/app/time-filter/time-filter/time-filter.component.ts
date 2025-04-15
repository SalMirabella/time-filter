import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
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
  @Output() dateRangeChanged = new EventEmitter<{ start: Date; end: Date }>();

  chartOption: EChartsCoreOption = {};
  echartsInstance: ECharts | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.data || this.data.length === 0) {
      this.generateDemoData();
    }
    this.initChart();
  }

  onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;

    ec.on('brushSelected', (params: any) => {
      const indices: number[] = params.batch[0]?.dataIndex ?? [];
      if (indices.length >= 2) {
        const start = new Date(this.data[indices[0]].date);
        const end = new Date(this.data[indices[indices.length - 1]].date);

        // Evidenzia la selezione
        const option = this.chartOption as any;
        if (option['series'] && option['series'][1]) {
          option['series'][1]['data'] = this.data.map((item, i) =>
            i >= indices[0] && i <= indices[indices.length - 1] ? item.value : null
          );
          this.echartsInstance?.setOption(option);
        }

        this.dateRangeChanged.emit({ start, end });
        this.cdr.detectChanges();
      }
    });
  }

  private initChart(): void {
    const dates = this.data.map(item => item.date);
    const values = this.data.map(item => item.value);

    this.chartOption = {
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        feature: {
          brush: { type: ['lineX', 'clear'] },
          restore: {}
        }
      },
      brush: {
        toolbox: ['lineX', 'clear'],
        xAxisIndex: 0,
        brushMode: 'single'
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          zoomOnMouseWheel: true,
          moveOnMouseWheel: true,
          moveOnMouseMove: true
        }
      ],
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
          name: 'Tutti i dati',
          type: 'line',
          data: values,
          smooth: true,
          lineStyle: { color: '#ccc', width: 2 },
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'Selezione evidenziata',
          type: 'line',
          data: values.map(() => null),
          smooth: true,
          lineStyle: { color: '#2196f3', width: 3 },
          areaStyle: { opacity: 0.3 }
        }
      ]
    };
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
}
