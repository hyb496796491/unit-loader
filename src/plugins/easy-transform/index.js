/**
 * default value transform
 * @param { string } value like 12px
 * @param { string } prop  rule property like font-size
 * @param { string } selectior css selector like .test
 * @param { object } option
 * ### from:
 * Type string,Default 'px'
 * the unit that you want to be replaced
 * ### to:
 * Type string, Default 'rem'
 * specify the string that replace the 'from' unit
 * ### ratio:
 * Type number,Default 1
 */
const DEFAULT_OPTION = {
	from: 'px',
	to: 'rem',
	ratio: 1
};
function easyTransform(value, prop, selectior, option) {
	option = { ...DEFAULT_OPTION, ...(option || {}) };
	const { from, to, ratio } = option;
	const regExp = new RegExp(`(\\d+)${from}`, 'g');
	if (!regExp.test(value)) return value;
	return value.replace(regExp, (a, b) => {
		b = parseFloat(b);
		if (Number.isNaN(b)) return b;
		return `${b * ratio}${to}`;
	});
}

module.exports = easyTransform;
