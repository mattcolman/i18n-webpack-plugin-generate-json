# Generate translation json files for [i18n-webpack-plugin](https://github.com/webpack-contrib/i18n-webpack-plugin)

[i18n-webpack-plugin](https://github.com/webpack-contrib/i18n-webpack-plugin) is great, but making translation files can be a big manual job! This script will search your app and generate translation json files for you.
This script is not tied to i18n-webpack-plugin at all. In fact I use it with my own translation function that is called at runtime. For that reason I provide the option to make your keys transformed to snake-case. This is my personal preference.

## Example package.json
```
  scripts: {
    "i18n-generate": "i18n-generate -d src -l 'de cn'"
  }
```

## Example app code
```
  <span>{__('oh hi, I need to be translated')}</span>
  <span>{__('this script will save me *NUMBER* hours').replace('*NUMBER*', 73)}</span> // variable replacement
```

## Example React + Webpack project
https://github.com/mattcolman/i18n-webpack-plugin-generate-json-example

## Install
`npm i i18n-webpack-plugin-generate-json --save-dev`

## Run
1. add a script (see example package.json)
2. `npm run i18n-generate`

## Options
- `-d, -directory, REQUIRED, default [none]`
- `-f, -functionName, default [__]`
- `-o, -outputDirectory, default [translations]`
- `-l, -languages, default ['en']`
- `-t, -transformise, default [false] : Transformises using lower snake case whilst preserving the * character to be used for variable substitution. e.g. the key for __('i have *number* ducks') is 'i_have_*number*_ducks'`
- `-p, -prefix, default [!!] : The prefix is so you can see visually what translations have been mapped in your application. It also allows this script to regenerate your un-translated sentences.`

## Gotchas
1. The script searches for the functionName and expects the contents to start with a single or double quote. So if you have something like `<span>{__(`twelve ${animal}s`)}</span>` or `<span>{__(isHello ? 'hello' : 'hi')}</span>`, it won't work! I don't think you need to do either of these things. The first example is a variable replacement, so it will need to use the method show in the example code above. The second example can be re-written to `<span>{isHello ? __('hello') : __('hi')}</span>`
