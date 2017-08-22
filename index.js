// use a custom transformise to keep *STARS* for variable subs.
// TODO - add an option to specify a different key
// NOTE = this will obviously cause issues with markdown text, but I imagine you would create a custom key for
// markdown anyway.
function transformise(string) {
  return string.toString()
    .toLowerCase()
    .replace(/[' ]/g, '_') // replace spaces & apostrophes with an underscore
    .replace(/[^a-z0-9_*]/g, '') // remove anything that isn't alphanumeric or underscore or *
    .replace(/_+/g, '_'); // replace multiple _'s with a single _
}

module.exports = { transformise };
