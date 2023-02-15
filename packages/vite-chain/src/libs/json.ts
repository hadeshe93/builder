import { JsonOptions } from 'vite';
import ChainedMap from './chained-map';

const SHORTHANDS = ['namedExports', 'stringify'];

export default class Json extends ChainedMap {
  namedExports: (value: JsonOptions['namedExports']) => this;
  stringify: (value: JsonOptions['stringify']) => this;


  constructor(parent) {
    super(parent);
    this.extend(SHORTHANDS);
  }
}
