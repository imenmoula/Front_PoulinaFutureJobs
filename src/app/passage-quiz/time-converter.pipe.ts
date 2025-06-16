import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeConverter' })
export class TimeConverterPipe implements PipeTransform {
  transform(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0m 0s';
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  }
}