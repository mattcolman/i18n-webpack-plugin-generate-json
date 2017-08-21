# Generate translation json files for [i18n-webpack-plugin](https://github.com/webpack-contrib/i18n-webpack-plugin)

## Example package.json
```
  scripts: {
    "i18n-generate": "i18n-generate -d src -l 'de cn'"
  }
```

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
- `-p, -prefix, default [!!]` The prefix is so you can see visually what translations have been mapped in your application. It also allows this plugin to regenerate your un-translated sentences.

## Example React + Webpack project
https://github.com/mattcolman/i18n-webpack-plugin-generate-json-example
