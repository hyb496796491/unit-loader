/**
 * @file unit conversion loader for webpack 
 */
const postcss = require('postcss');
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const optionSchema = require('./option-schema');
const { vendor } = postcss;
const { getOptions } = loaderUtils; 
/** default loader option */
const DEFAULT_LOADER_OPTION = {
    from: 'px',
    to: 'rem',
    ratio: 1,
    include: [],
    exclude: []
};
/** plugin name */
const PLUGIN_NAME = 'postcss-unit-transform-plugin';
/**
 * whether need to transform 
 */
function needToTransform(prop,include,exclude){
    prop = vendor.unprefixed(prop);
    if(include.length) return include.indexOf(prop) !== -1;
    if(exclude.length) return exclude.indexOf(prop) === -1;
    return true;
}
/**
 * value transform function 
 */
function transform(value,options){
    const callback = options.transform;
    const { from,to,ratio } = options;
    const regExp = new RegExp(`(\\d+)${from}`,'g');
    if(!regExp.test(value)) return value;
    return value.replace(regExp,(a,b)=>{
        if(typeof callback === 'function'){
            const callbackValue = callback(b,value);
            if(typeof callbackValue !== 'number') throw new Error('the transform option must return number!');
            return `${callbackValue}${to}`;
        };
        b = parseFloat(b);
        if(Number.isNaN(b)) return b;
        return `${b*ratio}${to}`;
    });
}
/**
 * post css plugin 
 */
function registerPlugin(loaderOption){
    return postcss.plugin(PLUGIN_NAME,function(opts={}){
        return function(root){
            let { from,to,include,exclude } = loaderOption;
            if(include.length) exclude = [];
            from = from.trim();
            to = to.trim();
            root.walkRules((rule)=>{
                // todo add ignore comment
                rule.walk((node)=>{
                    if(node.type === 'decl'){
                        const { prop,value } = node;
                        if(needToTransform(prop,include,exclude)){
                            const valueAfterTransform = transform(value,loaderOption);
                            if(valueAfterTransform !== value){
                                node.value = valueAfterTransform;
                            }
                        }
                    }
                });
            });
        };
    })
}

module.exports = function(source){
    const callback = this.async();
    const loaderOption = {
        ...DEFAULT_LOADER_OPTION,
        ...(getOptions(this) || {})
    };
    validateOptions(optionSchema,loaderOption);
    const plugin = registerPlugin(loaderOption);
    postcss(plugin)
        .process(source,{
            from: loaderUtils.getRemainingRequest(this).split("!").pop(),
		    to: loaderUtils.getCurrentRequest(this).split("!").pop(),
        })
        .then((result)=>{
            callback(null,result.toString());
        })
        .catch((error)=>{
            callback(error);
        });
}