import path from 'path';
import { rollup, RollupOptions, OutputOptions } from 'rollup';
import { createRollupConfig } from '../src/helpers/rollup';

const OUTPUT_DIR = path.resolve(__dirname, './dist');

async function main() {
  const rollupConfig = createRollupConfig({
    input: path.resolve(__dirname, '../src/assets/injection-script/index.ts'),
    format: 'iife',
    sourcemap: false,
    target: 'browser',
    define: {
      __USE_INJECTION__: JSON.stringify(true),
      __USE_INJECTION_DEBUGGER__: JSON.stringify(false),
      __USE_INJECTION_FLEXIBLE__: JSON.stringify(true),
      __USE_INJECTION_PAGE_SPEED_TESTER__: JSON.stringify(true),
    },
    // minify: true,
  });
  const { output: rawOutputConfig, ...inputConfig } = rollupConfig;
  const outputConfig = {
    dir: OUTPUT_DIR,
    ...rawOutputConfig,
  };
  console.log(rollupConfig);

  const bundle = await rollup(inputConfig as RollupOptions);
  const output = await bundle.write(outputConfig as OutputOptions)
  console.log(output);
}


main();