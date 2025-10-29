import { Injectable } from '@angular/core';
import {
  ValidationConfig,
  DataValidationRule,
  ValidationResult,
  ValidationContext,
  ValidationType,
  BuiltInValidators,
  FieldValidationState,
  ValidationState
} from '../interfaces/validation.interface';

/**
 * Validation Service
 * Advanced data validation with custom rules
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private config: ValidationConfig = {
    enabled: true,
    mode: 'immediate',
    showInlineErrors: true,
    preventInvalidSave: true,
    highlightInvalid: true,
    debounce: 300
  };

  private validators: BuiltInValidators;

  constructor() {
    this.validators = this.createBuiltInValidators();
  }

  /**
   * Configure validation
   */
  configure(config: Partial<ValidationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Validate value against rules
   */
  async validateValue(
    value: any,
    rules: DataValidationRule[],
    context?: Partial<ValidationContext>
  ): Promise<ValidationResult> {
    const startTime = performance.now();
    const errors: any[] = [];
    const warnings: any[] = [];

    // Sort rules by order
    const sortedRules = [...rules].sort((a, b) => (a.order || 0) - (b.order || 0));

    for (const rule of sortedRules) {
      // Skip if empty and skipIfEmpty is true
      if (rule.skipIfEmpty && this.isEmpty(value)) {
        continue;
      }

      try {
        const fullContext: ValidationContext = {
          row: {},
          ...context
        };

        const isValid = await rule.validator(value, fullContext.row, fullContext);

        if (!isValid) {
          const message = rule.messageTemplate 
            ? rule.messageTemplate(value, rule.params)
            : rule.message;

          errors.push({
            rule: rule.name,
            message,
            value
          });

          // Stop if validation failed and it's a critical rule
          if (rule.order === 0) break;
        }
      } catch (error: any) {
        errors.push({
          rule: rule.name,
          message: `Validation error: ${error.message}`,
          value
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validationTime: performance.now() - startTime
    };
  }

  /**
   * Validate row
   */
  async validateRow(
    row: any,
    columnValidations: Map<string, DataValidationRule[]>
  ): Promise<ValidationResult> {
    const startTime = performance.now();
    const errors: any[] = [];
    const warnings: any[] = [];
    const fieldErrors: Record<string, string[]> = {};

    for (const [field, rules] of columnValidations.entries()) {
      const value = row[field];
      const context: ValidationContext = {
        row,
        field
      };

      const result = await this.validateValue(value, rules, context);

      if (!result.valid && result.errors) {
        fieldErrors[field] = result.errors.map(e => e.message);
        errors.push(...result.errors.map(e => ({ ...e, field })));
      }

      if (result.warnings) {
        warnings.push(...result.warnings.map(w => ({ ...w, field })));
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      fieldErrors,
      validationTime: performance.now() - startTime
    };
  }

  /**
   * Create validation rule
   */
  createRule(
    type: ValidationType,
    params?: any,
    customMessage?: string
  ): DataValidationRule {
    const validator = this.getValidatorForType(type, params);
    const message = customMessage || this.getDefaultMessage(type, params);

    return {
      name: type,
      type,
      validator,
      message,
      params
    };
  }

  /**
   * Get validator for type
   */
  private getValidatorForType(type: ValidationType, params?: any): (value: any) => boolean {
    switch (type) {
      case ValidationType.REQUIRED:
        return this.validators.required;
      
      case ValidationType.EMAIL:
        return this.validators.email;
      
      case ValidationType.URL:
        return this.validators.url;
      
      case ValidationType.NUMERIC:
        return this.validators.numeric;
      
      case ValidationType.INTEGER:
        return this.validators.integer;
      
      case ValidationType.MIN:
        return (value: number) => this.validators.min(value, params);
      
      case ValidationType.MAX:
        return (value: number) => this.validators.max(value, params);
      
      case ValidationType.MIN_LENGTH:
        return (value: string) => this.validators.minLength(value, params);
      
      case ValidationType.MAX_LENGTH:
        return (value: string) => this.validators.maxLength(value, params);
      
      case ValidationType.PATTERN:
        return (value: string) => this.validators.pattern(value, params);
      
      case ValidationType.PHONE:
        return this.validators.phone;
      
      case ValidationType.DATE:
        return this.validators.date;
      
      default:
        return () => true;
    }
  }

  /**
   * Get default error message
   */
  private getDefaultMessage(type: ValidationType, params?: any): string {
    const messages: Record<ValidationType, string> = {
      [ValidationType.REQUIRED]: 'This field is required',
      [ValidationType.EMAIL]: 'Invalid email address',
      [ValidationType.URL]: 'Invalid URL',
      [ValidationType.NUMERIC]: 'Must be a number',
      [ValidationType.INTEGER]: 'Must be an integer',
      [ValidationType.DECIMAL]: 'Must be a decimal number',
      [ValidationType.MIN]: `Minimum value is ${params}`,
      [ValidationType.MAX]: `Maximum value is ${params}`,
      [ValidationType.MIN_LENGTH]: `Minimum length is ${params}`,
      [ValidationType.MAX_LENGTH]: `Maximum length is ${params}`,
      [ValidationType.PATTERN]: 'Invalid format',
      [ValidationType.PHONE]: 'Invalid phone number',
      [ValidationType.DATE]: 'Invalid date',
      [ValidationType.DATE_RANGE]: 'Invalid date range',
      [ValidationType.TIME]: 'Invalid time',
      [ValidationType.CUSTOM]: 'Validation failed',
      [ValidationType.UNIQUE]: 'Value must be unique',
      [ValidationType.MATCH]: 'Values do not match',
      [ValidationType.FUNCTION]: 'Validation failed',
      [ValidationType.CONDITIONAL]: 'Conditional validation failed'
    };

    return messages[type] || 'Validation failed';
  }

  /**
   * Check if value is empty
   */
  private isEmpty(value: any): boolean {
    return value == null || value === '' || (Array.isArray(value) && value.length === 0);
  }

  /**
   * Create built-in validators
   */
  private createBuiltInValidators(): BuiltInValidators {
    return {
      required: (value: any) => !this.isEmpty(value),
      
      email: (value: string) => {
        if (!value) return true;
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value);
      },
      
      url: (value: string) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      
      numeric: (value: any) => !isNaN(Number(value)),
      
      integer: (value: any) => Number.isInteger(Number(value)),
      
      min: (value: number, min: number) => Number(value) >= min,
      
      max: (value: number, max: number) => Number(value) <= max,
      
      minLength: (value: string, length: number) => String(value || '').length >= length,
      
      maxLength: (value: string, length: number) => String(value || '').length <= length,
      
      pattern: (value: string, pattern: RegExp) => {
        if (!value) return true;
        return pattern.test(value);
      },
      
      phone: (value: string) => {
        if (!value) return true;
        const pattern = /^[\d\s()+-]+$/;
        return pattern.test(value) && value.replace(/\D/g, '').length >= 10;
      },
      
      date: (value: any) => {
        if (!value) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      
      unique: (value: any, field: string, allRows: any[]) => {
        const values = allRows.map(row => row[field]);
        return values.filter(v => v === value).length <= 1;
      },
      
      match: (value: any, matchValue: any) => value === matchValue
    };
  }
}

