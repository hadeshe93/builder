import path from 'path';
import { Plugin } from 'esbuild';

/**
 * 自动将相关的依赖置为 external
 *
 * @export
 * @returns {*}  {Plugin}
 */
export function createEsbuildExternalizeDepsPlugin(): Plugin {
  return {
    name: 'esbuild-plugin-externalize-deps',
    setup(build) {
      const { initialOptions: buildOptions } = build;
      const { alias } = buildOptions;
      const shouldExternalizeAliasKeys = Object.keys(alias).filter(key => /node_modules/.test(alias[key]));
      build.onResolve({ filter: /.*/ }, (args) => {
        const id = args.path;
        const shouldExternalize = (id[0] !== '.' && !path.isAbsolute(id))
          || Boolean(shouldExternalizeAliasKeys.find(key => id.startsWith(key)));
        if (shouldExternalize) {
          return {
            external: true
          };
        }
      });
    },
  };
}