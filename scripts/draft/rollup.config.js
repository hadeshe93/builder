import path from 'path';

export default {
  input: path.resolve(__dirname, './index.js'),
  output: {
    dir: path.resolve(__dirname, './dist'),
    format: 'cjs'
  },
};