#!/usr/bin/env node
const fs = require('fs');
const _ = require('lodash/fp');
const glob = require('glob');
const path = require('path');

// README
// Searches through a directory to find all strings wrapped in __('') (or whatever function name you choose)
// it then compares these to the existing keys in [language].json file and adds only new keys
// with the english words to translate.
// English words are prefixed with !! (or whatever you choose) so we can see visually in our running application
// what has been mapped whilst awaiting translations.
// Prefixing also makes it easier to regex those mapped translations in case you need to for whatever reason.

// use a custom transformise to keep *STARS* for variable subs.
// TODO - add an option to specify a different key
//      - add option to snake-case transformise or not
// NOTE = this will obviously cause issues with markdown text, but I imagine you would create a custom key for
// markdown anyway.
function transformise(string) {
  return string.toString()
    .toLowerCase()
    .replace(/[' ]/g, '_') // replace spaces & apostrophes with an underscore
    .replace(/[^a-z0-9_*]/g, '') // remove anything that isn't alphanumeric or underscore or *
    .replace(/_+/g, '_'); // replace multiple _'s with a single _
}

function getLocaleConfig(dir, id) {
  try {
    const content = fs.readFileSync(`${dir}/${id}.json`);
    return JSON.parse(content);
  } catch (error) {
    console.warn(`No translation file exists for language "${id}"`);
  }
  return {};
}

// sort object keys alphabetically
function sortObject(obj) {
  return Object.keys(obj).sort().reduce((result, key) => (
    Object.assign({}, result, {
      [key]: obj[key],
    })
  ), {});
}

const argv = require('minimist')(process.argv.slice(2));
const dir = argv.d || argv.directory;
const functionName = argv.f || argv.functionName || '__';
const outputDirectory = argv.o || argv.output || 'translations';
const languages = argv.l || argv.languages || 'en';
const prefix = argv.p || argv.prefix || '!!';
const willTransformise = argv.t || argv.transformise || false;

if (!dir) console.error('no directory supplied. use -d');

// TODO - test if the outputDirectory exists

glob(`${dir}/**/*.js`, {}, (er, files) => {
  const value = _.compose(
    _.compact,
    _.uniq,
    _.flatten,
    _.map((file) => {
      const text = fs.readFileSync(file, 'utf8');
      const findTranslations = new RegExp(`(\\W${functionName}\\()(\'|\")(.*?)(\\))`, "g"); // finds all text wrapped in __('') or whatever you set it to
      const result = text.match(findTranslations);
      if (result) {
        // strip away '__(' and ')'
        return result.map(r => (
          r.slice(r.indexOf(functionName) + functionName.length + 2).slice(0, -2)
        ));
      }
      return null;
    }),
  )(files);
  const languagesArray = languages.split(' ');
  languagesArray.forEach((language) => {
    const localeText = getLocaleConfig(outputDirectory, language);
    const foundMap = _.keyBy(str => {
      return willTransformise ? transformise(str) : str;
    })(value);
    const newTranslations = _.pickBy((v, key) => {
      const found = localeText[key];
      return !found || found.search(prefix) !== -1;
    })(foundMap);
    console.log(`${language}: new translations found`, newTranslations);
    let newObject = Object.assign({},
      localeText,
      _.mapValues(str => `${prefix}${str}`)(newTranslations),
    );
    newObject = sortObject(newObject);
    fs.writeFileSync(
      `${outputDirectory}/${language}.json`,
      JSON.stringify(newObject, null, 2), 'utf8',
    );
  });
});
