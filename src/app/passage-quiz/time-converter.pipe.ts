import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeConverter' })
export class TimeConverterPipe implements PipeTransform {
  transform(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }
}