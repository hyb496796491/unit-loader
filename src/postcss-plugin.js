/**
 * @file post-plugin
 */
const postcss = require('postcss');
const plugins = require('./plugins');
const { vendor } = postcss;
/** plugin name */
const POSTCSS_PLUGIN_NAME = 'postcss-unit-transform-plugin';

/**
 * whether need to transform
 * @param { string } prop
 * @param { array } include
 * @param { array } exclude
 * @return { boolean }
 */
function isNeedToTransform(prop, include, exclude) {
	prop = vendor.unprefixed(prop);
	if (include.length) return include.indexOf(prop) !== -1;
	if (exclude.length) return exclude.indexOf(prop) === -1;
	return true;
}

/**
 * get transform plugin
 * @param { object } pluginOptions plugin option { use: [function,string],option: {} }
 * @return { function }
 */
function getTransformPlugin(pluginOptions) {
	let { use = 'easyTransformPlugin', option } = pluginOptions;
	if (typeof use === 'string') use = plugins[use];
	if (typeof use !== 'function')
		throw new Error(
			'the use in plugin option must be function or function name'
		);
	return function(...arg) {
		return use.apply(null, [...arg, option || {}]);
	};
}

function postcssPlugin(loaderOption) {
	return postcss.plugin(POSTCSS_PLUGIN_NAME, function(opts = {}) {
		return function(root) {
			let { include, exclude, plugin } = loaderOption;
			if (include.length) exclude = [];
			root.walkRules((rule) => {
				// todo add ignore comment
				const { selector } = rule;
				rule.walk((node) => {
					if (node.type === 'decl') {
						const { prop, value } = node;
						if (isNeedToTransform(prop, include, exclude)) {
							let transformPlugin = getTransformPlugin(plugin);
							const valueAfterTransform = transformPlugin.call(
								null,
								value,
								prop,
								selector
							);
							if (typeof valueAfterTransform !== 'string')
								throw new Error(
									'the transform plugin must return string!'
								);
							if (valueAfterTransform !== value) {
								node.value = valueAfterTransform;
							}
						}
					}
				});
			});
		};
	});
}

module.exports = postcssPlugin;
