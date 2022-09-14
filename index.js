const { fromJson } = require('json-joi-converter');
const messages = require('./messages');

const validate = (schema, data, options = { throwException: true }) => {
  const joiOptions = {
    abortEarly: false,
    stripUnknown: true,
    presence: 'required',
    errors: { label: false },
    cache: false,
    messages,
    ...(options.joi || {})
  };

  const defaultGenerateError = (error) => {
    return error.details.reduce((error, item) => {
      console.log(item);
      error[`${item.path.join('.')}`] = item.message;
      return error;
    }, {});
  }

  const { value, error: joiError } = fromJson({ type: 'object', properties: schema }).validate(data, joiOptions);
  const error = joiError
    ? (typeof options.generateError === 'function')
      ? options.generateError(joiError)
      : defaultGenerateError(joiError)
    : null;

  if (error && options.throwException) { throw error; }
  return (error && !options.throwException) ? { value, error } : value;
}

module.exports = validate;
