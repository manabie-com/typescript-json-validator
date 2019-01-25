import {inspect} from 'util';
import Ajv = require('ajv');
import ExampleType from './Example';
export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export {ExampleType};
export const ExampleTypeSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  defaultProperties: [],
  properties: {
    answer: {
      default: 42,
      type: 'number',
    },
    email: {
      format: 'email',
      type: 'string',
    },
    value: {
      type: 'string',
    },
  },
  required: ['answer', 'value'],
  type: 'object',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<Ajv.ValidateFunction, 'errors'>;
const rawValidateExampleType = ajv.compile(
  ExampleTypeSchema,
) as ValidateFunction<ExampleType>;
export default function validate(value: unknown): ExampleType {
  if (rawValidateExampleType(value)) {
    return value;
  } else {
    throw new Error(
      ajv.errorsText(rawValidateExampleType.errors, {dataVar: 'ExampleType'}) +
        '\n\n' +
        inspect(value),
    );
  }
}