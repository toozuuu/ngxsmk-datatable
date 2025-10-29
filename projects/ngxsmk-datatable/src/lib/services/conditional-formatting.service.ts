import { Injectable } from '@angular/core';
import {
  ConditionalFormattingConfig,
  ConditionalFormattingRule,
  FormattingResult,
  CellFormat,
  FormattingContext,
  ConditionType,
  ColumnStatistics
} from '../interfaces/conditional-formatting.interface';

/**
 * Conditional Formatting Service
 * Dynamic cell styling based on values and conditions
 */
@Injectable({
  providedIn: 'root'
})
export class ConditionalFormattingService {
  private config: ConditionalFormattingConfig = {
    enabled: true,
    priorityMode: 'first-match',
    cacheStyles: true,
    recalculateOnChange: true
  };

  private rules: ConditionalFormattingRule[] = [];
  private statsCache: Map<string, ColumnStatistics> = new Map();
  private formatCache: Map<string, FormattingResult> = new Map();

  constructor() {}

  /**
   * Configure conditional formatting
   */
  configure(config: Partial<ConditionalFormattingConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.rules) {
      this.rules = config.rules;
    }

    if (config.globalRules) {
      this.rules.push(...config.globalRules);
    }
  }

  /**
   * Add rule
   */
  addRule(rule: ConditionalFormattingRule): void {
    this.rules.push(rule);
    this.sortRules();
  }

  /**
   * Remove rule
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  /**
   * Get formatting for cell
   */
  getFormatting(
    value: any,
    row: any,
    field: string,
    rowIndex?: number,
    allRows?: any[]
  ): FormattingResult {
    const cacheKey = `${field}-${rowIndex}-${JSON.stringify(value)}`;
    
    if (this.config.cacheStyles && this.formatCache.has(cacheKey)) {
      return this.formatCache.get(cacheKey)!;
    }

    const context: FormattingContext = {
      value,
      row,
      field,
      rowIndex,
      allRows,
      stats: this.getColumnStats(field, allRows || [])
    };

    const matchedRules: ConditionalFormattingRule[] = [];
    const applicableRules = this.rules.filter(r => 
      r.enabled !== false && 
      (!r.fields || r.fields.includes(field))
    );

    for (const rule of applicableRules) {
      if (this.evaluateCondition(rule.condition, context)) {
        matchedRules.push(rule);
        
        if (this.config.priorityMode === 'first-match' || rule.stopIfTrue) {
          break;
        }
      }
    }

    const result = this.mergeFormats(matchedRules);
    
    if (this.config.cacheStyles) {
      this.formatCache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(condition: any, context: FormattingContext): boolean {
    if (condition.customFunction) {
      return condition.customFunction(context.value, context.row, context);
    }

    if (condition.formula) {
      // Would use formula service in real implementation
      return false;
    }

    switch (condition.type) {
      case ConditionType.EQUALS:
        return context.value == condition.value;
      
      case ConditionType.NOT_EQUALS:
        return context.value != condition.value;
      
      case ConditionType.GREATER_THAN:
        return Number(context.value) > Number(condition.value);
      
      case ConditionType.GREATER_THAN_OR_EQUAL:
        return Number(context.value) >= Number(condition.value);
      
      case ConditionType.LESS_THAN:
        return Number(context.value) < Number(condition.value);
      
      case ConditionType.LESS_THAN_OR_EQUAL:
        return Number(context.value) <= Number(condition.value);
      
      case ConditionType.BETWEEN:
        return Number(context.value) >= Number(condition.value) && 
               Number(context.value) <= Number(condition.value2);
      
      case ConditionType.CONTAINS:
        return String(context.value || '').includes(String(condition.value));
      
      case ConditionType.NOT_CONTAINS:
        return !String(context.value || '').includes(String(condition.value));
      
      case ConditionType.STARTS_WITH:
        return String(context.value || '').startsWith(String(condition.value));
      
      case ConditionType.ENDS_WITH:
        return String(context.value || '').endsWith(String(condition.value));
      
      case ConditionType.IS_EMPTY:
        return context.value == null || context.value === '';
      
      case ConditionType.IS_NOT_EMPTY:
        return context.value != null && context.value !== '';
      
      case ConditionType.IS_NULL:
        return context.value == null;
      
      case ConditionType.IS_NOT_NULL:
        return context.value != null;
      
      case ConditionType.ABOVE_AVERAGE:
        return !!(context.stats && Number(context.value) > context.stats.average!);
      
      case ConditionType.BELOW_AVERAGE:
        return !!(context.stats && Number(context.value) < context.stats.average!);
      
      case ConditionType.DUPLICATE:
        return this.isDuplicate(context.value, context.field, context.allRows || []);
      
      case ConditionType.UNIQUE:
        return !this.isDuplicate(context.value, context.field, context.allRows || []);
      
      default:
        return false;
    }
  }

  /**
   * Merge formats from multiple rules
   */
  private mergeFormats(rules: ConditionalFormattingRule[]): FormattingResult {
    const merged: CellFormat = {};
    const cssClasses: string[] = [];
    const inlineStyles: Record<string, string> = {};

    for (const rule of rules) {
      Object.assign(merged, rule.format);
      
      if (rule.format.cssClasses) {
        cssClasses.push(...rule.format.cssClasses);
      }
    }

    // Convert format to inline styles
    if (merged.backgroundColor) inlineStyles['background-color'] = merged.backgroundColor;
    if (merged.color) inlineStyles['color'] = merged.color;
    if (merged.fontWeight) inlineStyles['font-weight'] = String(merged.fontWeight);
    if (merged.fontSize) inlineStyles['font-size'] = merged.fontSize;
    if (merged.fontStyle) inlineStyles['font-style'] = merged.fontStyle;
    if (merged.textDecoration) inlineStyles['text-decoration'] = merged.textDecoration;
    if (merged.border) inlineStyles['border'] = merged.border;
    if (merged.borderColor) inlineStyles['border-color'] = merged.borderColor;

    return {
      matchedRules: rules,
      format: merged,
      cssClasses,
      inlineStyles
    };
  }

  /**
   * Get column statistics
   */
  private getColumnStats(field: string, rows: any[]): ColumnStatistics | undefined {
    if (this.statsCache.has(field)) {
      return this.statsCache.get(field);
    }

    const values = rows.map(r => r[field]).filter(v => v != null);
    
    if (values.length === 0) return undefined;

    const numericValues = values.filter(v => !isNaN(Number(v))).map(Number);
    
    const stats: ColumnStatistics = {
      count: values.length,
      uniqueValues: [...new Set(values)]
    };

    if (numericValues.length > 0) {
      stats.sum = numericValues.reduce((sum, v) => sum + v, 0);
      stats.average = stats.sum / numericValues.length;
      stats.min = Math.min(...numericValues);
      stats.max = Math.max(...numericValues);
      
      const sorted = [...numericValues].sort((a, b) => a - b);
      stats.median = sorted[Math.floor(sorted.length / 2)];
      
      const variance = numericValues.reduce((sum, v) => sum + Math.pow(v - stats.average!, 2), 0) / numericValues.length;
      stats.stdDev = Math.sqrt(variance);
    }

    this.statsCache.set(field, stats);
    return stats;
  }

  /**
   * Check if value is duplicate
   */
  private isDuplicate(value: any, field: string, rows: any[]): boolean {
    const count = rows.filter(r => r[field] === value).length;
    return count > 1;
  }

  /**
   * Sort rules by priority
   */
  private sortRules(): void {
    this.rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Clear caches
   */
  clearCache(): void {
    this.formatCache.clear();
    this.statsCache.clear();
  }
}

