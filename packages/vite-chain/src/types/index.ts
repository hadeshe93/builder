import { UserConfig, ResolveOptions } from 'vite';

import ChainedMap from '../libs/chained-map';
import ChainedSet from '../libs/chained-set';
import Resolve from '../libs/resolve';
import Css from '../libs/css';
import Json from '../libs/json';
import Plugin from '../libs/plugin';
import Build from '../libs/build';
import Preview from '../libs/preview';
import OptimizeDeps from '../libs/optimize-deps';
import SSR from '../libs/ssr';
import Worker from '../libs/worker';
import Server, { Fs }  from '../libs/server';

export interface EndableChainedMap<T> extends ChainedMap {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableChainedSet<T> extends ChainedSet {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableResolve<T> extends Resolve {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableCss<T> extends Css {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableJson<T> extends Json {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndablePlugin<T> extends Plugin {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableServer<T> extends Server {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableServerFs<T> extends Fs {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableBuild<T> extends Build {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndablePreview<T> extends Preview {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableOptimizeDeps<T> extends OptimizeDeps {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableSSR<T> extends SSR {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface EndableWorker<T> extends Worker {
  // 重写类型声明，避免类型丢失
  end: () => T;
}

export interface MergeObject {
  // ====================== 共享选项 START ======================
  root?: UserConfig['root'];
  base?: UserConfig['base'];
  mode?: UserConfig['mode'];
  publicDir?: UserConfig['publicDir'];
  cacheDir?: UserConfig['cacheDir'];
  esbuild?: UserConfig['esbuild'];
  assetsInclude?: UserConfig['assetsInclude'];
  logLevel?: UserConfig['logLevel'];
  clearScreen?: UserConfig['clearScreen'];
  envDir?: UserConfig['envDir'];
  envPrefix?: UserConfig['envPrefix'];
  appType?: UserConfig['appType'];
  define?: UserConfig['define'];
  resolve?: ResolveOptions & {
    alias?: Record<string, string>;
  };
  css?: UserConfig['css'];
  json?: UserConfig['json'];
  plugin?: {
    [pluginName: string]: {
      plugin?: any;
      args?: any[];
      [otherKey: string]: any;
    };
  };
  // ====================== 共享选项 END ======================

  // ====================== 服务器选项 START ======================
  server?: UserConfig['server'];
  // ====================== 服务器选项 END ======================

  // ====================== 构建选项 START ======================
  build?: UserConfig['build'];
  // ====================== 构建选项 END ======================

  // ====================== 预览选项 START ======================
  preview?: UserConfig['preview'];
  // ====================== 预览选项 END ======================

  // ====================== 优化选项 START ======================
  optimizeDeps?: UserConfig['optimizeDeps'];
  // ====================== 优化选项 END ======================

  // ====================== ssr 选项 START ======================
  ssr?: UserConfig['ssr'];
  // ====================== ssr 选项 END ======================

  // ====================== worker 选项 START ======================
  worker?: UserConfig['worker'];
  // ====================== worker 选项 END ======================
}