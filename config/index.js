const config = require("./config.json");
const defaultConfig = require("./defaultConfig.json");
const localConfig = require("./localConfig.json");
let _defaultsDeep = require("lodash/defaultsDeep");

module.exports = _defaultsDeep(localConfig, defaultConfig, config);
