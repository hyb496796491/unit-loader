# unit-loader

unit transform loader for webpack

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `unit-loader`:

```console
$ npm install unit-loader --save-dev
```
note: `unit-loader` must use before `css-loader`

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(css)$/i,
                use: [
                    { loader: 'css-loader' },
                    { loader: 'unit-loader' }
                ]
            }
        ]
    }
}
```
And run `webpack` via your preferred method.

## Options

### `include`

Type: `Array`
Default: `[]`

set the property you want to transform

### `exclude`

Type: `Array`
Default: `[]`

the property in exclude array will not be transform

### `plugin`

Type: `Object`,
Default: `{ use: 'easyTransformPlugin',option: { from: 'px',to: 'rem',ratio: 1 } }`

if you need a different way to transform the unit, the `plugin` option give you the ability:

```js

// webpack config
{
    test: /\.(css)$/i,
    use: [
        { loader: 'css-loader' },
        { 
            loader: 'unit-loader',
            options: {
                plugin: {
                    use: function(value,property,selector,option){
                        // here is your transform code 
                        // note must return string
                        return '0vm';
                    },
                    option: {}
                }
            }
        }
    ]
}
```



