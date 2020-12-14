const _defaultsDeep = require("lodash/defaultsDeep");
const config = require("./config.json");
const defaultConfig = require("./defaultConfig.json");
const localConfig = require("./localConfig.json");

module.exports = _defaultsDeep(localConfig, defaultConfig, config);
