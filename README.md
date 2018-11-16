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

### `from`

Type: `String`
Default: `px`

The unit you want to replace

### `to`

Type: `String`
Default: `rem`

### `ratio`

Type: `Number`
Default: `1`

the number to calculate,for instance：

```css
// css rule
.test{
    font-size: 20px;
}
```
if the ratio is 0.5,the result will be
```
.test{
    font-size: 10rem;
}
```

### `include`(Must have)

Type: `Array`
Default: `[]`

set the property you want to transform

### `exclude`(Must have)

Type: `Array`
Default: `[]`

the property in exclude array will not be transform

### `transform`(Must have)

Type: `Function`,
Default: `undefined`

if you need different way to calculate value,the `transform` function will be a best choice:

```js

// webpack config
{
    test: /\.(css)$/i,
    use: [
        { loader: 'css-loader' },
        { 
            loader: 'unit-loader',
            options: {
                transform: function(valueWithoutNumber){
                    return parseInt(valueWithoutNumber*0.6)
                }
            }
        }
    ]
}
```



