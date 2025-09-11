import { registerDecorator, ValidationOptions } from 'class-validator';
import { checkDefault } from './defaut-role-check.constraint';
export function CheckDefaultRole(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'CheckDefaultRole',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: checkDefault,
    });
  };
}
