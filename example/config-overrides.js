const rewireRawLoader = require("@baristalabs/react-app-rewire-raw-loader");

module.exports = function override(config, env) {
  config = rewireRawLoader(config, env);
  return config;
};
