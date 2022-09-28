import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { createRequire } from 'module';

const PACKAGES_RELATIVE_PATH = 'packages';
const PROJECT_ROOT_PATH = path.resolve(__dirname, '../../');

function resolveRoot(...args) {
  return path.resolve(PROJECT_ROOT_PATH, ...args);
}

/**
 * 获取所有可以被构建的 packages 目标列表
 *
 * @export
 * @returns 目标列表
 */
export function getAllPackageTargets(): string[] {
  return fs.readdirSync(resolveRoot(PACKAGES_RELATIVE_PATH)).filter((f) => {
    if (!fs.statSync(resolveRoot(path.join(PACKAGES_RELATIVE_PATH, f))).isDirectory()) {
      return false;
    }
    const pkg = require(resolveRoot(path.join(PACKAGES_RELATIVE_PATH, f, 'package.json')));
    if (pkg.private || !pkg.buildOptions) {
      return false;
    }
    return true;
  });
}

/**
 * 获取命令行指定要构建的 package
 *
 * @export
 * @returns 目标列表
 */
export function getTargets(): string[] {
  return minimist(process.argv.slice(2))._;
}
