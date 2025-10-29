import { Injectable } from '@angular/core';
import {
  FormulaConfig,
  FormulaExpression,
  FormulaContext,
  FormulaResult,
  FormulaValidation,
  FormulaFunctions,
  ComputedColumn,
  FormulaFunction
} from '../interfaces/formula.interface';

/**
 * Formula Service
 * Excel-like formula calculations and computed columns
 */
@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  private config: FormulaConfig = {
    enabled: true,
    autoRecalculate: true,
    detectCircularReferences: true,
    maxDepth: 100,
    errorHandling: 'return-error',
    cacheResults: true,
    precision: 10
  };

  private builtInFunctions: Map<string, FormulaFunction> = new Map();
  private customFunctions: Map<string, FormulaFunction> = new Map();
  private formulaCache: Map<string, any> = new Map();
  private computedColumns: Map<string, ComputedColumn> = new Map();

  constructor() {
    this.initializeBuiltInFunctions();
  }

  /**
   * Configure formula service
   */
  configure(config: Partial<FormulaConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.customFunctions) {
      Object.entries(config.customFunctions).forEach(([name, fn]) => {
        this.registerFunction(name, fn);
      });
    }
  }

  /**
   * Register custom function
   */
  registerFunction(name: string, fn: FormulaFunction): void {
    this.customFunctions.set(name.toUpperCase(), fn);
  }

  /**
   * Parse formula expression
   */
  parseFormula(formula: string): FormulaExpression {
    // Remove leading = if present
    const cleanFormula = formula.trim().startsWith('=') ? formula.trim().substring(1) : formula.trim();

    try {
      const tokens = this.tokenize(cleanFormula);
      const dependencies = this.extractDependencies(tokens);

      return {
        raw: formula,
        tokens,
        dependencies,
        compiled: this.compileFormula(cleanFormula)
      };
    } catch (error: any) {
      return {
        raw: formula,
        tokens: [],
        dependencies: [],
        error: error.message
      };
    }
  }

  /**
   * Calculate formula
   */
  calculate(formula: string, context: FormulaContext): FormulaResult {
    const startTime = performance.now();
    const cacheKey = this.getCacheKey(formula, context.row);

    // Check cache
    if (this.config.cacheResults && this.formulaCache.has(cacheKey)) {
      return {
        value: this.formulaCache.get(cacheKey),
        success: true,
        calculationTime: 0,
        cached: true
      };
    }

    try {
      const expression = this.parseFormula(formula);
      
      if (expression.error) {
        return {
          value: null,
          success: false,
          error: expression.error,
          calculationTime: performance.now() - startTime
        };
      }

      const value = expression.compiled!(context);
      const calculationTime = performance.now() - startTime;

      // Cache result
      if (this.config.cacheResults) {
        this.formulaCache.set(cacheKey, value);
      }

      return {
        value,
        success: true,
        calculationTime,
        cached: false
      };
    } catch (error: any) {
      return {
        value: null,
        success: false,
        error: error.message,
        calculationTime: performance.now() - startTime
      };
    }
  }

  /**
   * Validate formula
   */
  validate(formula: string): FormulaValidation {
    try {
      const expression = this.parseFormula(formula);
      
      if (expression.error) {
        return {
          valid: false,
          error: expression.error
        };
      }

      // Check for circular references
      if (this.config.detectCircularReferences) {
        const circular = this.detectCircular(expression.dependencies);
        if (circular) {
          return {
            valid: false,
            error: 'Circular reference detected',
            circularReference: true,
            dependencies: expression.dependencies
          };
        }
      }

      return {
        valid: true,
        dependencies: expression.dependencies
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Register computed column
   */
  registerComputedColumn(column: ComputedColumn): void {
    this.computedColumns.set(column.field, column);
  }

  /**
   * Calculate computed column value
   */
  calculateComputedColumn(field: string, row: any, allRows?: any[]): any {
    const column = this.computedColumns.get(field);
    if (!column) return null;

    const context: FormulaContext = {
      row,
      allRows,
      functions: Object.fromEntries([...this.builtInFunctions, ...this.customFunctions])
    };

    const result = this.calculate(column.formula, context);
    
    if (result.success && column.format) {
      return column.format(result.value);
    }

    return result.value;
  }

  /**
   * Clear formula cache
   */
  clearCache(): void {
    this.formulaCache.clear();
  }

  /**
   * Tokenize formula
   */
  private tokenize(formula: string): any[] {
    const tokens: any[] = [];
    const regex = /([A-Z_][A-Z0-9_]*)\s*\(|([A-Z_][A-Z0-9_]*)|(\d+\.?\d*)|(".*?")|([+\-*/(),=<>!&|])/gi;
    let match;

    while ((match = regex.exec(formula)) !== null) {
      if (match[1]) {
        tokens.push({ type: 'function', value: match[1], position: match.index });
      } else if (match[2]) {
        tokens.push({ type: 'field', value: match[2], position: match.index });
      } else if (match[3]) {
        tokens.push({ type: 'value', value: parseFloat(match[3]), position: match.index });
      } else if (match[4]) {
        tokens.push({ type: 'value', value: match[4].slice(1, -1), position: match.index });
      } else if (match[5]) {
        tokens.push({ type: 'operator', value: match[5], position: match.index });
      }
    }

    return tokens;
  }

  /**
   * Extract field dependencies from tokens
   */
  private extractDependencies(tokens: any[]): string[] {
    return tokens
      .filter(t => t.type === 'field')
      .map(t => t.value)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  /**
   * Compile formula to function
   */
  private compileFormula(formula: string): Function {
    return (context: FormulaContext) => {
      // Create evaluation context
      const evalContext: any = {
        ...context.row,
        ...context.variables
      };

      // Add functions to context
      const functions = { ...Object.fromEntries(this.builtInFunctions), ...Object.fromEntries(this.customFunctions) };
      Object.assign(evalContext, functions);

      try {
        // Use Function constructor for safe evaluation
        const fn = new Function(...Object.keys(evalContext), `return ${formula};`);
        return fn(...Object.values(evalContext));
      } catch (error: any) {
        throw new Error(`Formula evaluation error: ${error.message}`);
      }
    };
  }

  /**
   * Detect circular references
   */
  private detectCircular(dependencies: string[], visited: Set<string> = new Set()): boolean {
    for (const dep of dependencies) {
      if (visited.has(dep)) return true;
      
      visited.add(dep);
      const column = this.computedColumns.get(dep);
      
      if (column && column.dependencies) {
        if (this.detectCircular(column.dependencies, new Set(visited))) {
          return true;
        }
      }
      
      visited.delete(dep);
    }
    
    return false;
  }

  /**
   * Get cache key
   */
  private getCacheKey(formula: string, row: any): string {
    return `${formula}-${JSON.stringify(row)}`;
  }

  /**
   * Initialize built-in functions
   */
  private initializeBuiltInFunctions(): void {
    // Math functions
    this.builtInFunctions.set('SUM', (...args: number[]) => args.reduce((sum, n) => sum + (Number(n) || 0), 0));
    this.builtInFunctions.set('AVERAGE', (...args: number[]) => {
      const nums = args.filter(n => !isNaN(Number(n)));
      return nums.length > 0 ? nums.reduce((sum, n) => sum + Number(n), 0) / nums.length : 0;
    });
    this.builtInFunctions.set('AVG', this.builtInFunctions.get('AVERAGE')!);
    this.builtInFunctions.set('MIN', (...args: number[]) => Math.min(...args.map(Number)));
    this.builtInFunctions.set('MAX', (...args: number[]) => Math.max(...args.map(Number)));
    this.builtInFunctions.set('COUNT', (...args: any[]) => args.length);
    this.builtInFunctions.set('ROUND', (num: number, decimals = 0) => Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals));
    this.builtInFunctions.set('FLOOR', Math.floor);
    this.builtInFunctions.set('CEIL', Math.ceil);
    this.builtInFunctions.set('ABS', Math.abs);
    this.builtInFunctions.set('SQRT', Math.sqrt);
    this.builtInFunctions.set('POW', Math.pow);

    // String functions
    this.builtInFunctions.set('CONCAT', (...args: any[]) => args.join(''));
    this.builtInFunctions.set('UPPER', (str: string) => String(str).toUpperCase());
    this.builtInFunctions.set('LOWER', (str: string) => String(str).toLowerCase());
    this.builtInFunctions.set('TRIM', (str: string) => String(str).trim());
    this.builtInFunctions.set('LEFT', (str: string, len: number) => String(str).substring(0, len));
    this.builtInFunctions.set('RIGHT', (str: string, len: number) => String(str).substring(String(str).length - len));
    this.builtInFunctions.set('MID', (str: string, start: number, len: number) => String(str).substring(start, start + len));
    this.builtInFunctions.set('LEN', (str: string) => String(str).length);

    // Date functions
    this.builtInFunctions.set('NOW', () => new Date());
    this.builtInFunctions.set('TODAY', () => new Date(new Date().setHours(0, 0, 0, 0)));
    this.builtInFunctions.set('YEAR', (date: Date) => new Date(date).getFullYear());
    this.builtInFunctions.set('MONTH', (date: Date) => new Date(date).getMonth() + 1);
    this.builtInFunctions.set('DAY', (date: Date) => new Date(date).getDate());

    // Logical functions
    this.builtInFunctions.set('IF', (condition: boolean, trueValue: any, falseValue: any) => condition ? trueValue : falseValue);
    this.builtInFunctions.set('AND', (...args: boolean[]) => args.every(Boolean));
    this.builtInFunctions.set('OR', (...args: boolean[]) => args.some(Boolean));
    this.builtInFunctions.set('NOT', (value: boolean) => !value);
    this.builtInFunctions.set('ISNULL', (value: any) => value == null);
    this.builtInFunctions.set('ISEMPTY', (value: any) => value == null || value === '');
  }
}

