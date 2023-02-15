import type { UserConfig } from 'vite';
import Plugin from './libs/plugin';
import Css from './libs/css';
import Json from './libs/json';
import Server from './libs/server';
import Resolve from './libs/resolve';
import Build from './libs/build';
import OptimizeDeps from './libs/optimize-deps';
import SSR from './libs/ssr';
import Worker from './libs/worker';
import ChainedMap from './libs/chained-map';
import type {
  EndableChainedMap,
  EndableResolve,
  EndableCss,
  EndableJson,
  EndableServer,
  EndableBuild,
  EndablePreview,
  EndableOptimizeDeps,
  EndableSSR,
  EndableWorker,
  MergeObject,
} from './types/index';
import Preview from './libs/preview';

export default class ViteChain extends ChainedMap {
  // ====================== 共享选项 START ======================
  // 通过 extend 方法扩展的 shorthands
  root: (value: UserConfig['root']) => this;
  base: (value: UserConfig['base']) => this;
  mode: (value: UserConfig['mode']) => this;
  publicDir: (value: UserConfig['publicDir']) => this;
  cacheDir: (value: UserConfig['cacheDir']) => this;
  esbuild: (value: UserConfig['esbuild']) => this;
  assetsInclude: (value: UserConfig['assetsInclude']) => this;
  logLevel: (value: UserConfig['logLevel']) => this;
  clearScreen: (value: UserConfig['clearScreen']) => this;
  envDir: (value: UserConfig['envDir']) => this;
  envPrefix: (value: UserConfig['envDir']) => this;
  appType: (value: UserConfig['appType']) => this;
  // 其他
  define: EndableChainedMap<typeof this> = new ChainedMap(this);
  resolve: EndableResolve<typeof this> = new Resolve(this);
  plugins: EndableChainedMap<typeof this> = new ChainedMap(this);
  css: EndableCss<typeof this> = new Css(this);
  json: EndableJson<typeof this> = new Json(this);
  // ====================== 共享选项 END ======================

  // ====================== 服务器选项 START ======================
  server: EndableServer<typeof this> = new Server(this);
  // ====================== 服务器选项 END ======================

  // ====================== 服务器选项 START ======================
  build: EndableBuild<typeof this> = new Build(this);
  // ====================== 服务器选项 END ======================

  // ====================== 预览选项 START ======================
  preview: EndablePreview<typeof this> = new Preview(this);
  // ====================== 预览选项 END ======================

  // ====================== 优化选项 START ======================
  optimizeDeps: EndableOptimizeDeps<typeof this> = new OptimizeDeps(this);
  // ====================== 预览选项 END ======================

  // ====================== SSR 选项 START ======================
  ssr: EndableSSR<typeof this> = new SSR(this);
  // ====================== SSR 选项 END ======================

  // ====================== worker 选项 START ======================
  worker: EndableWorker<typeof this> = new Worker(this);
  // ====================== worker 选项 END ======================

  constructor() {
    super(Object.create(null));
    this.extend(ViteChain.SHORTHANDS);
  }

  plugin(name): InstanceType<typeof Plugin> {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name));
  }

  merge(obj: MergeObject, omit: string[] = []) {
    const DEFAULT_OMISSIONS = [
      'define',
      'resolve',
      'plugin',
      'css',
      'json',
      'server',
      'build',
      'preview',
      'optimizeDeps',
      'ssr',
      'worker',
    ];
    const omissions = Array.from(new Set([...DEFAULT_OMISSIONS, ...omit]));
    DEFAULT_OMISSIONS.filter(key => !omit.includes(key) && Object.prototype.hasOwnProperty.call(obj, key)).forEach((key) => {
      if (key === 'plugin') {
        Object.entries(obj.plugin).forEach(([name, plugin]) => {
          this.plugin(name).merge(plugin);
        });
      } else {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omissions]);
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        define: this.define.entries(),
        resolve: this.resolve.toConfig(),
        css: this.css.entries(),
        json: this.json.entries(),
        server: this.server.toConfig(),
        build: this.build.toConfig(),
        preview: this.preview.toConfig(),
        optimizeDeps: this.optimizeDeps.toConfig(),
        ssr: this.ssr.toConfig(),
        worker: this.worker.toConfig(),
        plugins: this.plugins.values().map((plugin: InstanceType<typeof Plugin>) => plugin.toConfig()),
      })
    );
  }

  static readonly SHORTHANDS = [
    'root',
    'base',
    'mode',
    'publicDir',
    'cacheDir',
    'esbuild',
    'assetsInclude',
    'logLevel',
    'clearScreen',
    'envPrefix',
    'appType',
  ];
}

export type {
  MergeObject,
};