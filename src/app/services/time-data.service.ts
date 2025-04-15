import { Injectable } from '@angular/core';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class TimeDataService {
  /**
   * Genera una lista di dati casuali su base giornaliera
   * per un intervallo predefinito (ultimi 90 giorni).
   */
  generateDemoData(): { date: string; value: number }[] {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);

    const data: { date: string; value: number }[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      data.push({
        date: dayjs(d).format('YYYY-MM-DD'),
        value: Math.floor(Math.random() * 1000) + 500
      });
    }

    return data;
  }
}
