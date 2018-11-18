/**
 * @file unit conversion loader for webpack
 */
const postcss = require('postcss');
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const optionSchema = require('./option-schema');
const postcssPlugin = require('./postcss-plugin');
/** default loader option */
const DEFAULT_LOADER_OPTION = {
	include: [],
	exclude: [],
	plugin: {}
};

module.exports = function(source) {
	const callback = this.async();
	const loaderOption = {
		...DEFAULT_LOADER_OPTION,
		...(loaderUtils.getOptions(this) || {})
	};
	validateOptions(optionSchema, loaderOption);
	postcss(postcssPlugin(loaderOption))
		.process(source, {
			from: loaderUtils
				.getRemainingRequest(this)
				.split('!')
				.pop(),
			to: loaderUtils
				.getCurrentRequest(this)
				.split('!')
				.pop()
		})
		.then((result) => {
			callback(null, result.toString());
		})
		.catch((error) => {
			callback(error);
		});
};
