module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-self-compare': [0],
    "semi": [2, "never"],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "comma-dangle": [2, "only-multiline"],
    "brace-style": [2, "stroustrup"],
    "object-curly-spacing": [2, "never"]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
