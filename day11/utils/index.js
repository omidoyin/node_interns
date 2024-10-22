function capitalizeFirstLetter(target) {
  if (typeof target !== 'string') {
    throw new Error('Parameter should be a string.');
  }
  return target?.substring(0, 1).toUpperCase() + target?.substring(1)?.toLocaleLowerCase();
}

module.exports = {
  capitalizeFirstLetter,
};
