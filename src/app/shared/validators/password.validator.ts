import { validate, type PathKind, type SchemaPath } from '@angular/forms/signals';

export const hasNonAlphanumeric = (field: SchemaPath<string, 1, PathKind.Child>, options?: { message?: string }) => {
  return validate(field, ({ value }) => {
    const pattern = /[^a-zA-Z0-9]/;
    if (!pattern.test(value())) {
      return {
        kind: 'hasNonAlphanumeric',
        message: options?.message || 'Password must have at least one non alphanumeric character',
      };
    }
    return null;
  });
};

export const hasDigit = (field: SchemaPath<string, 1, PathKind.Child>, options?: { message?: string }) => {
  return validate(field, ({ value }) => {
    const pattern = /\d/;
    if (!pattern.test(value())) {
      return {
        kind: 'hasDigit',
        message: options?.message || "Password must have at least one digit ('0'-'9')",
      };
    }
    return null;
  });
};

export const hasUppercase = (field: SchemaPath<string, 1, PathKind.Child>, options?: { message?: string }) => {
  return validate(field, ({ value }) => {
    const pattern = /[A-Z]/;
    if (!pattern.test(value())) {
      return {
        kind: 'hasUppercase',
        message: options?.message || "Password must have at least one uppercase ('A'-'Z')",
      };
    }
    return null;
  });
};

export const minLength = (field: SchemaPath<string, 1, PathKind.Child>, length: number, options?: { message?: string }) => {
  return validate(field, ({ value }) => {
    if (value().length < length) {
      return {
        kind: 'minLength',
        message: options?.message || `Password must be at least ${length} characters long`,
      };
    }
    return null;
  });
};

export const passwordValidator = (field: SchemaPath<string, 1, PathKind.Child>, options?: { message?: string; minLength?: number }) => {
  const minPasswordLength = options?.minLength ?? 6;
  hasNonAlphanumeric(field);
  hasDigit(field);
  hasUppercase(field);
  minLength(field, minPasswordLength);
};
