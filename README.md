# Generate translation json files for [i18n-webpack-plugin](https://github.com/webpack-contrib/i18n-webpack-plugin)

[i18n-webpack-plugin](https://github.com/webpack-contrib/i18n-webpack-plugin) is great, but making translation files can be a big manual job! This script will search your app and generate translation json files for you.
It's actually not tied to i18n-webpack-plugin at all. In fact I use it with my own translation function that is called at runtime. For that reason I provide the option to make your keys transformed to snake-case. This is my personal preference.

## Basic Example

### package.json
```
  scripts: {
    "i18n-generate": "i18n-generate -d src -l 'de cn'"
  }
```

### App code
```
  <span>{__('oh hi, I need to be translated')}</span>
  <span>{__('this script will save me *NUMBER* hours').replace('*NUMBER*', 73)}</span> // variable replacement
```

### Output translation json - send it to the translator. Regenerating it won't delete existing translations.
```
  {
    "oh hi, I need to be translated": "!!oh hi, I need to be translated",
    "this script will save me *NUMBER* hours": "!!this script will save me *NUMBER* hours"
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
- `-t, -transformise, default [false] : Transformises using lower snake case whilst preserving the * character to be used for variable substitution. e.g. the key for __('i have *number* ducks') is 'i_have_*number*_ducks'`
- `-p, -prefix, default [!!] : The prefix is so you can see visually what translations have been mapped in your application. It also allows this script to regenerate your un-translated sentences.`

## Advanced Example using lower-snake-case keys
```
  import { transformise } from 'i18n-webpack-plugin-generate-json';

  // custom translate function
  export function translate(translations, key) {
    const translation = translations[transformise(key)];
    if (translation) return translation;    
    return key;
  }
```

## Example React + Webpack project
https://github.com/mattcolman/i18n-webpack-plugin-generate-json-example

## Gotchas
1. The script searches for the functionName and expects the contents to start with a single or double quote. This is because translations are static, so the contents of your functionName must also be static.

#### This won't work
```<span>{__(`twelve ${animal}s`)}</span>```
#### Instead
```<span>{__('twelve *ANIMAL*s').replace('*ANIMAL*', animal)}</span>```

#### This won't work
```<span>{__(isHello ? 'hello' : 'hi')}</span>```
#### Instead
```<span>{isHello ? __('hello') : __('hi')}</span>```
