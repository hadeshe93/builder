import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { UserConfig, ServerOptions, BuildOptions, PreviewOptions, DepOptimizationOptions, SSROptions } from 'vite';
import { MergeObject } from '@/types/index';
import ViteChain from '@/index';

type WorkerOptions = UserConfig['worker'];

describe('针对 ViteChain 的测试集', () => {
  test('ViteChain 的共享选项配置单测', () => {
    const config = new ViteChain();
    const mockedConfigJSON = {
      root: process.cwd(),
      base: '/',
      mode: 'development',
      publicDir: 'public',
      cacheDir: './.vite',
      define: {
        __APP_VERSION__: JSON.stringify('1.0.0'),
      },
      resolve: {
        browserField: true,
        alias: {
          '@': '/path/to/src',
        },
        mainFields: ['module', 'jsnext:main', 'jsnext'],
      },
      css: {
        devSourcemap: true,
      },
      json: {
        namedExports: true,
      },
      esbuild: false,
      assetsInclude: ['**/*.jpeg', '**/*.jpg'],
      logLevel: 'info',
      plugins: [vue(), legacy()],
    };
    config
      .root(mockedConfigJSON.root)
      .base(mockedConfigJSON.base)
      .mode(mockedConfigJSON.mode)
      .resolve.browserField(mockedConfigJSON.resolve.browserField)
      .alias.set('@', mockedConfigJSON.resolve.alias['@'])
      .end()
      .mainFields.batch((that) => {
        mockedConfigJSON.resolve.mainFields.forEach((field) => that.add(field));
      })
      .end()
      .end()
      .css.devSourcemap(mockedConfigJSON.css.devSourcemap)
      .end()
      .json.namedExports(mockedConfigJSON.json.namedExports)
      .end()
      .esbuild(mockedConfigJSON.esbuild as false)
      .assetsInclude(mockedConfigJSON.assetsInclude)
      .logLevel(mockedConfigJSON.logLevel as 'info')
      .publicDir(mockedConfigJSON.publicDir)
      .cacheDir(mockedConfigJSON.cacheDir)
      .define.batch((that) => {
        Object.entries(mockedConfigJSON.define).forEach(([key, value]) => {
          that.set(key, value);
        });
      })
      .end()
      .plugin('vue')
        .use(vue)
        .end()
      .plugin('legacy')
        .use(legacy)
        .end();
    expect(transform2Json(config.toConfig())).toEqual(transform2Json(mockedConfigJSON));
  });

  test('ViteChain 的服务器选项配置单测', () => {
    const config = new ViteChain();
    const mockedConfigJSON: { server: ServerOptions } = {
      server: {
        host: true,
        port: 8888,
        strictPort: true,
        fs: {
          strict: true,
        },
      },
    };
    config.server
      .host(mockedConfigJSON.server.host)
      .port(mockedConfigJSON.server.port)
      .strictPort(mockedConfigJSON.server.strictPort)
      .fs.strict(true)
      .end();
    expect(transform2Json(config.toConfig())).toEqual(transform2Json(mockedConfigJSON));
  });

  test('ViteChain 的构建选项配置单测', () => {
    const config = new ViteChain();
    const mockedConfigJSON: { build: BuildOptions } = {
      build: {
        target: ['not ie 11', 'iOS >= 10'],
        outDir: 'dist',
        assetsDir: 'assets',
      },
    };
    config.build
      .target(mockedConfigJSON.build.target)
      .outDir(mockedConfigJSON.build.outDir)
      .assetsDir(mockedConfigJSON.build.assetsDir);
    expect(transform2Json(config.toConfig())).toEqual(transform2Json(mockedConfigJSON));
  });

  test('ViteChain 的预览选项配置单测', () => {
    const config = new ViteChain();
    const mockedConfigJSON: { preview: PreviewOptions } = {
      preview: {
        host: true,
        port: 8888,
        strictPort: true,
      },
    };
    config.preview
      .host(mockedConfigJSON.preview.host)
      .port(mockedConfigJSON.preview.port)
      .strictPort(mockedConfigJSON.preview.strictPort);
    expect(transform2Json(config.toConfig())).toEqual(transform2Json(mockedConfigJSON));
  });

  test('ViteChain 的优化选项配置单测', () => {
    const config = new ViteChain();
    const mockedConfigJSON: { optimizeDeps: DepOptimizationOptions } = {
      optimizeDeps: {
        entries: ['**/*.index.html'],
        force: true,
      },
    };
    config.optimizeDeps.entryList(mockedConfigJSON.optimizeDeps.entries).force(mockedConfigJSON.optimizeDeps.force);
    expect(transform2Json(config.toConfig())).toEqual(transform2Json(mockedConfigJSON));
  });

  test('ViteChain 的 ssr 选项配置单测', () => {
    const config = new ViteChain();
    const mockedConfigJSON: { ssr: SSROptions } = {
      ssr: {
        noExternal: ['vant'],
        target: 'node',
        format: 'cjs',
      },
    };
    config.ssr
      .noExternal(mockedConfigJSON.ssr.noExternal)
      .target(mockedConfigJSON.ssr.target)
      .format(mockedConfigJSON.ssr.format);
    expect(transform2Json(config.toConfig())).toEqual(transform2Json(mockedConfigJSON));
  });

  test('ViteChain 的 worker 选项配置单测', () => {
    const config = new ViteChain();
    const mockedConfigJSON: { worker: WorkerOptions } = {
      worker: {
        format: 'iife',
      },
    };
    config.worker
      .format(mockedConfigJSON.worker.format);
    expect(transform2Json(config.toConfig())).toEqual(transform2Json(mockedConfigJSON));
  });

  test('ViteChain 的 merge 方法单测', () => {
    const config = new ViteChain();
    const mockedConfigJSON: MergeObject = {
      resolve: {
        alias: {
          '@': '/path/to/src'
        },
      },
    };
    config.merge(mockedConfigJSON);
    expect(transform2Json(config.toConfig())).toEqual(transform2Json(mockedConfigJSON));
  });
});

function transform2Json(jsonLikeObject: Record<string, any>) {
  return JSON.parse(JSON.stringify(jsonLikeObject));
}
