import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { ECharts, EChartsCoreOption } from 'echarts/core';
import dayjs from 'dayjs';

@Component({
  selector: 'app-time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.css'],
  standalone: false
})
export class TimeFilterComponent implements OnInit {
  @Input() data: { index: number; date: string; value: number }[] = [];
  @Output() dateRangeChanged = new EventEmitter<{ start: Date; end: Date }>();

  chartOption: EChartsCoreOption = {};
  echartsInstance: ECharts | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initChart();
  }

  onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;
    console.log('✅ Chart initialized');

    ec.on('brushSelected', (params: any) => {
      console.log('📌 brushSelected event triggered', params);

      const area = params.batch[0]?.areas?.[0];
      const coordRange = area?.coordRange;

      if (!Array.isArray(coordRange) || coordRange.length !== 2) {
        return;
      }

      const [rawStart, rawEnd] = coordRange;
      const startCoord = Math.round(rawStart);
      const endCoord = Math.round(rawEnd);


      const sorted = [startCoord, endCoord].sort((a, b) => a - b);
      const validStart = sorted[0];
      const validEnd = sorted[1];

      const startItem = this.data.find(item => item.index === validStart);
      const endItem = this.data.find(item => item.index === validEnd);

      if (!startItem || !endItem) {
        return;
      }

      const start = new Date(startItem.date);
      const end = new Date(endItem.date);

      const highlightedData = this.data.map(item =>
        item.index >= validStart && item.index <= validEnd ? item.value : null
      );

      const baseOption = this.chartOption as any;

      const newOption: EChartsCoreOption = {
        ...this.chartOption,
        series: [
          baseOption['series']?.[0],
          {
            ...baseOption['series']?.[1],
            data: highlightedData
          }
        ]
      };

      ec.setOption(newOption, { notMerge: false });

      this.dateRangeChanged.emit({ start, end });

      this.cdr.detectChanges();
    });
  }

  private initChart(): void {
    const indices = this.data.map(item => item.index);
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
      xAxis: {
        type: 'category',
        data: indices,
        axisLabel: {
          formatter: (value: string | number) => {
            const index = parseInt(value as string, 10);
            if (isNaN(index) || index < 0 || index >= this.data.length) {
              return '';
            }
            return dayjs(this.data[index].date).format('DD/MM/YYYY');
          }
        }
      },
      yAxis: {
        type: 'value',
        scale: true
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
}
