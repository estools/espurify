const ecmaVersions = {
  2020: require('./es2020')
};

module.exports = () => {
  return ecmaVersions['2020'];
};
