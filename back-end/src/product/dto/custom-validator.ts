import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'validateSubAttribute', async: false })
export class ValidateSubAttribute implements ValidatorConstraintInterface {
  validate(attributes: any[], args: ValidationArguments) {
    const attributeMap = new Map();

    for (const item of attributes) {
      const { attribute, subAttribute } = item;

      if (!attributeMap.has(attribute)) {
        attributeMap.set(attribute, new Set());
      }

      if (attributeMap.get(attribute).has(subAttribute)) {
        return false; // Nếu `subAttribute` đã tồn tại trong `attribute`, trả về false
      }

      attributeMap.get(attribute).add(subAttribute);
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'SubAttribute in the same attribute should not be duplicated!';
  }
}
