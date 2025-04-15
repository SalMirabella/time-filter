import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFilterComponent } from './time-filter/time-filter.component';

import { NgxEchartsModule } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  DataZoomComponent,
  ToolboxComponent,
  BrushComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// ⬇️ Registrazione dei moduli usati
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  DataZoomComponent,
  CanvasRenderer,
  ToolboxComponent,
  BrushComponent
]);

@NgModule({
  declarations: [
    TimeFilterComponent
  ],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({ echarts }) // ✅ Import fondamentale
  ],
  exports: [
    TimeFilterComponent
  ]
})
export class TimeFilterModule {}
