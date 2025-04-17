// src/app/services/time-data.service.ts
import { Injectable } from '@angular/core';
import rawModelData from './mock-data.json'; // ← Import diretto

@Injectable({
  providedIn: 'root'
})
export class TimeDataService {
  convertModelToChartData(): { index: number; date: string; value: number }[] {
    const timePeriods = rawModelData.Aggregations?.timePeriods;
    if (!Array.isArray(timePeriods)) return [];

    return timePeriods.map((item, index) => ({
      index,
      date: item.Key,
      value: item.Count
    }));
  }
}
