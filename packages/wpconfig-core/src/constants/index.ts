import path from 'path';

export const PAGE_NAME_PLACEHOLDER = '${pageName}';
export const AUTO_NAME_PLACEHOLDER = '[name]';
export const SUPPORTED_ENTRY_EXTENSIONS = ['.js', '.ts'];

export const PAGES_RELATIVE_PATH = 'src/pages';
export const BACKUP_ENTRY_RELATIVE_PATH = 'src/main';
export const PUBLIC_TEMPLATE_RELATIVE_PATH = 'public/index.html';
export const PAGE_ENTRY_RELATIVE_PATH = path.join(PAGES_RELATIVE_PATH, `/${PAGE_NAME_PLACEHOLDER}/main`);
export const PAGE_TEMPLATE_RELATIVE_PATH = path.join(PAGES_RELATIVE_PATH, `/${PAGE_NAME_PLACEHOLDER}/index.html`);
export const OUTPUT_RELATIVE_PATH = `dist/${PAGE_NAME_PLACEHOLDER}`;

// DLL 相关
export const DLL_PUBLIC_RELATIVE_PATH = '../common';
export const DLL_OUTPUT_RELATIVE_PATH = 'dist/common';
export const DLL_OUTPUT_MANIFEST_NAME = `${AUTO_NAME_PLACEHOLDER}.mainifest.json`;

// 开发调试相关
export const DEV_SERVER_FE_PORT = 3000;
export const DEVTOOL = 'inline-source-map';