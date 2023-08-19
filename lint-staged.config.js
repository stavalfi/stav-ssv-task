module.exports = {
  'packages/**/*.{ts,d.ts}': files => {
    return [`yarn lint:code:base --fix ${files.join(' ')}`, `git add ${files.join(' ')}`]
  },
}
