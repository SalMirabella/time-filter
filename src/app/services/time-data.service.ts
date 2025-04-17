
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class TimeDataService {
  generateDemoData(): { index: number; date: string; value: number }[] {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);

    const data: { index: number; date: string; value: number }[] = [];

    let i = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      data.push({
        index: i++,
        date: dayjs(d).format('YYYY-MM-DD'),
        value: Math.floor(Math.random() * 1000) + 500
      });
    }

    return data;
  }
}
