import { CSSOptions } from 'vite';
import ChainedMap from './chained-map';

const SHORTHANDS = ['modules', 'postcss', 'preprocessorOptions', 'devSourcemap'];

export default class Css extends ChainedMap {
  modules: (value: CSSOptions['modules']) => this;
  postcss: (value: CSSOptions['postcss']) => this;
  preprocessorOptions: (value: CSSOptions['preprocessorOptions']) => this;
  devSourcemap: (value: CSSOptions['devSourcemap']) => this;


  constructor(parent) {
    super(parent);
    this.extend(SHORTHANDS);
  }
}
