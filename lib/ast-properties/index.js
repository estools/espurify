const ecmaVersions = {
  2022: require('./es2022'),
  2021: require('./es2020'), // no change in AST Node level
  2020: require('./es2020'),
  2019: require('./es2018'), // no change in AST Node level
  2018: require('./es2018'),
  2017: require('./es2017'),
  2016: require('./es2015'), // no change in AST Node level
  2015: require('./es2015'),
  5: require('./es5')
};

module.exports = (ecmaVersion) => {
  const version = ecmaVersion || 2022;
  return ecmaVersions[version];
};
