import { Injectable } from '@angular/core';
import {
  ChartingConfig,
  ColumnChartConfig,
  ChartType,
  ChartDataPoint,
  SparklineOptions,
  BulletChartOptions,
  GaugeOptions,
  ProgressOptions
} from '../interfaces/charting.interface';

/**
 * Charting Service
 * Provides sparklines, mini charts, and inline visualizations
 */
@Injectable({
  providedIn: 'root'
})
export class ChartingService {
  private config: ChartingConfig = {
    enabled: true,
    defaultHeight: 30,
    defaultWidth: 100,
    colorScheme: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'],
    animated: true,
    animationDuration: 300,
    showTooltips: true,
    theme: 'auto'
  };

  constructor() {}

  /**
   * Configure charting service
   */
  configure(config: Partial<ChartingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Render chart for column
   */
  renderChart(data: any, config: ColumnChartConfig): string {
    if (config.renderer) {
      const chartData = this.prepareChartData(data, config);
      return config.renderer(chartData, config);
    }

    switch (config.type) {
      case 'sparkline':
        return this.renderSparkline(data, config);
      case 'bar':
        return this.renderBar(data, config);
      case 'bullet':
        return this.renderBullet(data, config);
      case 'progress':
        return this.renderProgress(data, config);
      case 'gauge':
        return this.renderGauge(data, config);
      default:
        return this.renderSparkline(data, config);
    }
  }

  /**
   * Render sparkline chart
   */
  private renderSparkline(data: any, config: ColumnChartConfig): string {
    const values = this.extractValues(data, config);
    if (values.length === 0) return '';

    const options = config.options as SparklineOptions || {};
    const width = config.width || this.config.defaultWidth!;
    const height = config.height || this.config.defaultHeight!;
    const color = options.lineColor || this.config.colorScheme![0];

    const points = this.normalizeValues(values, width, height);
    const pathData = this.createSparklinePath(points, options);

    let svg = `<svg width="${width}" height="${height}" class="ngxsmk-sparkline">`;

    // Fill area
    if (options.fillArea) {
      const fillPath = pathData + ` L ${width},${height} L 0,${height} Z`;
      svg += `<path d="${fillPath}" fill="${options.fillColor || color}" opacity="0.3"/>`;
    }

    // Line
    svg += `<path d="${pathData}" stroke="${color}" stroke-width="${options.lineWidth || 2}" fill="none"/>`;

    // Dots
    if (options.showDots) {
      points.forEach(p => {
        svg += `<circle cx="${p.x}" cy="${p.y}" r="${options.dotRadius || 2}" fill="${color}"/>`;
      });
    }

    // Highlight min/max
    if (options.highlightMinMax) {
      const minPoint = points.reduce((min, p) => p.y > min.y ? p : min);
      const maxPoint = points.reduce((max, p) => p.y < max.y ? p : max);
      
      svg += `<circle cx="${minPoint.x}" cy="${minPoint.y}" r="3" fill="${options.minColor || '#e74c3c'}"/>`;
      svg += `<circle cx="${maxPoint.x}" cy="${maxPoint.y}" r="3" fill="${options.maxColor || '#2ecc71'}"/>`;
    }

    // Last value label
    if (options.showLastValue && values.length > 0) {
      const lastValue = values[values.length - 1];
      const lastPoint = points[points.length - 1];
      svg += `<text x="${lastPoint.x + 5}" y="${lastPoint.y + 4}" font-size="10" fill="${color}">${lastValue}</text>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Render bar chart
   */
  private renderBar(data: any, config: ColumnChartConfig): string {
    const values = this.extractValues(data, config);
    if (values.length === 0) return '';

    const width = config.width || this.config.defaultWidth!;
    const height = config.height || this.config.defaultHeight!;
    const barWidth = (width / values.length) - 2;
    const max = Math.max(...values);

    let svg = `<svg width="${width}" height="${height}" class="ngxsmk-bar-chart">`;

    values.forEach((value, index) => {
      const barHeight = (value / max) * height;
      const x = index * (barWidth + 2);
      const y = height - barHeight;
      const color = config.colors?.[index % config.colors.length] || this.config.colorScheme![0];

      svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}"/>`;
    });

    svg += '</svg>';
    return svg;
  }

  /**
   * Render bullet chart
   */
  private renderBullet(data: any, config: ColumnChartConfig): string {
    const options = config.options as BulletChartOptions;
    if (!options) return '';

    const width = config.width || this.config.defaultWidth!;
    const height = options.barHeight || 20;

    let svg = `<svg width="${width}" height="${height}" class="ngxsmk-bullet-chart">`;

    // Ranges
    if (options.ranges) {
      options.ranges.forEach(range => {
        const rangeWidth = ((range.to - range.from) / (options.ranges![options.ranges!.length - 1].to)) * width;
        const x = (range.from / options.ranges![options.ranges!.length - 1].to) * width;
        svg += `<rect x="${x}" y="0" width="${rangeWidth}" height="${height}" fill="${range.color}" opacity="0.3"/>`;
      });
    }

    // Value bar
    const maxValue = options.ranges?.[options.ranges.length - 1]?.to || 100;
    const valueWidth = (options.value / maxValue) * width;
    svg += `<rect x="0" y="${height * 0.3}" width="${valueWidth}" height="${height * 0.4}" fill="${options.valueColor || '#3498db'}"/>`;

    // Target marker
    if (options.target != null) {
      const targetX = (options.target / maxValue) * width;
      svg += `<line x1="${targetX}" y1="0" x2="${targetX}" y2="${height}" stroke="${options.targetColor || '#000'}" stroke-width="2"/>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Render progress bar
   */
  private renderProgress(data: any, config: ColumnChartConfig): string {
    const options = config.options as ProgressOptions;
    if (!options) return '';

    const width = config.width || this.config.defaultWidth!;
    const height = options.height || 20;
    const max = options.max || 100;
    const percentage = (options.value / max) * 100;
    const progressWidth = (percentage / 100) * width;

    const colorMap: Record<string, string> = {
      success: '#2ecc71',
      warning: '#f39c12',
      danger: '#e74c3c',
      info: '#3498db'
    };

    const color = options.status ? colorMap[options.status] : (options.color || '#3498db');
    const bgColor = options.backgroundColor || '#ecf0f1';

    let html = `<div class="ngxsmk-progress" style="width:${width}px;height:${height}px;background:${bgColor};border-radius:${options.borderRadius || 4}px;overflow:hidden;position:relative;">`;
    
    let barClasses = '';
    if (options.striped) barClasses += 'striped ';
    if (options.animated) barClasses += 'animated ';

    html += `<div class="${barClasses}" style="width:${progressWidth}px;height:100%;background:${color};transition:width 0.3s ease;"></div>`;

    if (options.showPercentage) {
      html += `<span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:12px;font-weight:bold;">${percentage.toFixed(0)}%</span>`;
    }

    html += '</div>';
    return html;
  }

  /**
   * Render gauge chart
   */
  private renderGauge(data: any, config: ColumnChartConfig): string {
    const options = config.options as GaugeOptions;
    if (!options) return '';

    const size = config.width || 100;
    const radius = size / 2;
    const min = options.min || 0;
    const max = options.max || 100;
    const value = options.value;
    
    const percentage = ((value - min) / (max - min)) * 100;
    const angle = (percentage / 100) * 180 - 90;

    let svg = `<svg width="${size}" height="${size / 2 + 20}" class="ngxsmk-gauge">`;

    // Background arc
    svg += `<path d="${this.describeArc(radius, radius, radius - 10, -90, 90)}" fill="none" stroke="#ecf0f1" stroke-width="10"/>`;

    // Value arc with zones
    if (options.zones && options.zones.length > 0) {
      options.zones.forEach(zone => {
        const zoneStartAngle = ((zone.from - min) / (max - min)) * 180 - 90;
        const zoneEndAngle = ((zone.to - min) / (max - min)) * 180 - 90;
        svg += `<path d="${this.describeArc(radius, radius, radius - 10, zoneStartAngle, zoneEndAngle)}" fill="none" stroke="${zone.color}" stroke-width="10"/>`;
      });
    }

    // Needle
    const needleX = radius + (radius - 20) * Math.cos(angle * Math.PI / 180);
    const needleY = radius + (radius - 20) * Math.sin(angle * Math.PI / 180);
    svg += `<line x1="${radius}" y1="${radius}" x2="${needleX}" y2="${needleY}" stroke="${options.needleColor || '#000'}" stroke-width="2"/>`;
    svg += `<circle cx="${radius}" cy="${radius}" r="5" fill="${options.needleColor || '#000'}"/>`;

    // Value text
    if (options.showValue) {
      const displayValue = options.valueFormat ? options.valueFormat(value) : value.toString();
      svg += `<text x="${radius}" y="${radius + 20}" text-anchor="middle" font-size="14" font-weight="bold">${displayValue}</text>`;
    }

    // Label
    if (options.label) {
      svg += `<text x="${radius}" y="${radius + 35}" text-anchor="middle" font-size="10" fill="#7f8c8d">${options.label}</text>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Extract values from data
   */
  private extractValues(data: any, config: ColumnChartConfig): number[] {
    if (Array.isArray(data)) {
      return data.map(v => Number(v) || 0);
    }

    if (typeof config.dataField === 'string') {
      const value = data[config.dataField];
      if (Array.isArray(value)) {
        return value.map(v => Number(v) || 0);
      }
      return [Number(value) || 0];
    }

    if (Array.isArray(config.dataField)) {
      return config.dataField.map(field => Number(data[field]) || 0);
    }

    return [];
  }

  /**
   * Prepare chart data
   */
  private prepareChartData(data: any, config: ColumnChartConfig): ChartDataPoint[] {
    const values = this.extractValues(data, config);
    return values.map((y, index) => ({
      x: index,
      y,
      label: `Point ${index + 1}`
    }));
  }

  /**
   * Normalize values to fit in chart dimensions
   */
  private normalizeValues(values: number[], width: number, height: number): Array<{ x: number; y: number }> {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return values.map((value, index) => ({
      x: (index / (values.length - 1 || 1)) * width,
      y: height - ((value - min) / range) * (height - 10) - 5
    }));
  }

  /**
   * Create sparkline path
   */
  private createSparklinePath(points: Array<{ x: number; y: number }>, options: SparklineOptions): string {
    if (points.length === 0) return '';

    const curve = options.curve || 'linear';
    let path = `M ${points[0].x},${points[0].y}`;

    if (curve === 'smooth') {
      // Bezier curve
      for (let i = 1; i < points.length; i++) {
        const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
        const cp1y = points[i - 1].y;
        const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
        const cp2y = points[i].y;
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i].x},${points[i].y}`;
      }
    } else if (curve === 'step') {
      // Step function
      for (let i = 1; i < points.length; i++) {
        path += ` H ${points[i].x} V ${points[i].y}`;
      }
    } else {
      // Linear
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x},${points[i].y}`;
      }
    }

    return path;
  }

  /**
   * Describe SVG arc
   */
  private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  /**
   * Convert polar to cartesian coordinates
   */
  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): { x: number; y: number } {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }
}

