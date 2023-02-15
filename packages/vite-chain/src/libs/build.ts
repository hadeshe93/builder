import { BuildOptions } from 'vite';
import ChainedMap from './chained-map';
import { chainableToConfig } from '../utils/object';

export default class Build extends ChainedMap {
  target: (value: BuildOptions['target']) => this;
  modulePreload: (value: BuildOptions['modulePreload']) => this;
  outDir: (value: BuildOptions['outDir']) => this;
  assetsDir: (value: BuildOptions['assetsDir']) => this;
  assetsInlineLimit: (value: BuildOptions['assetsInlineLimit']) => this;
  cssCodeSplit: (value: BuildOptions['cssCodeSplit']) => this;
  cssTarget: (value: BuildOptions['cssTarget']) => this;
  sourcemap: (value: BuildOptions['sourcemap']) => this;
  rollupOptions: (value: BuildOptions['rollupOptions']) => this;
  commonjsOptions: (value: BuildOptions['commonjsOptions']) => this;
  dynamicImportVarsOptions: (value: BuildOptions['dynamicImportVarsOptions']) => this;
  lib: (value: BuildOptions['lib']) => this;
  manifest: (value: BuildOptions['manifest']) => this;
  ssrManifest: (value: BuildOptions['ssrManifest']) => this;
  ssr: (value: BuildOptions['ssr']) => this;
  minify: (value: BuildOptions['minify']) => this;
  terserOptions: (value: BuildOptions['terserOptions']) => this;
  write: (value: BuildOptions['write']) => this;
  emptyOutDir: (value: BuildOptions['emptyOutDir']) => this;
  copyPublicDir: (value: BuildOptions['copyPublicDir']) => this;
  reportCompressedSize: (value: BuildOptions['reportCompressedSize']) => this;
  chunkSizeWarningLimit: (value: BuildOptions['chunkSizeWarningLimit']) => this;
  watch: (value: BuildOptions['watch']) => this;

  constructor(parent) {
    super(parent);
    this.extend(Build.SHORTHANDS);
  }

  /**
   * 合并
   *
   * @param {Record<string, any>} obj
   * @param {*} [omit=[]]
   * @returns {*}
   * @memberof Resolve
   */
  merge(obj: Record<string, any>, omit = []) {
    const omissions = Array.from(new Set(Build.NOT_SHORTHANDS.concat(omit)));
    const includedNotShorthandOmissions = Build.NOT_SHORTHANDS.filter((item) => !omit.includes(item));

    // 复杂的属性手动进行合并
    includedNotShorthandOmissions.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omissions]);
  }

  /**
   * 转成 json
   *
   * @returns {*}
   * @memberof Resolve
   */
  toConfig() {
    const notShorthandConfigs = Build.NOT_SHORTHANDS.reduce((acc, key) => {
      acc[key] = chainableToConfig(this[key]);
      return acc;
    }, {} as Record<string, any>);
    return this.clean(Object.assign(this.entries() || {}, notShorthandConfigs));
  }

  static SHORTHANDS = [
    'target',
    'modulePreload',
    // polyfillModulePreload 在 Vite3 中已被废弃
    // 'polyfillModulePreload',
    'outDir',
    'assetsDir',
    'assetsInlineLimit',
    'cssCodeSplit',
    'cssTarget',
    'sourcemap',
    'rollupOptions',
    'commonjsOptions',
    'dynamicImportVarsOptions',
    'lib',
    'manifest',
    'ssrManifest',
    'ssr',
    'minify',
    'terserOptions',
    'write',
    'emptyOutDir',
    'copyPublicDir',
    'reportCompressedSize',
    'chunkSizeWarningLimit',
    'watch',
  ];
  static NOT_SHORTHANDS = [];
}