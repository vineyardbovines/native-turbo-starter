const screamingAsConstRule = require("./screaming-as-const.cjs");

const plugin = { rules: { "screaming-as-const": screamingAsConstRule } };

module.exports = plugin;
