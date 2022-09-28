import { WebpackOptionsNormalized, Configuration } from 'webpack';

// 暂时用以规避单独使用 Configuration['output'] 产生类型报错的问题
export interface Outputs extends Required<Configuration['output']> {
  [key: string]: any;
}
export interface Resolve extends Required<Configuration['resolve']> {
  [key: string]: any;
}
export interface Optimization extends Required<Configuration['optimization']> {
  [key: string]: any;
}
export interface DevServer extends Required<WebpackOptionsNormalized['devServer']> {
  [key: string]: any;
}
export type Plugins = Required<Configuration['plugins']>;
export type Plugin = Plugins extends Array<infer U> ? U : any;
export type PluginClass = {
  new (...args: any[]): Plugin;
  prototype: Plugin;
};
export type DevTool = Required<WebpackOptionsNormalized['devtool']>;
export type Target = Required<WebpackOptionsNormalized['target']>;
export type Watch = Required<WebpackOptionsNormalized['watch']>;
export interface WatchOptions extends Required<WebpackOptionsNormalized['watchOptions']> {
  [key: string]: any;
}
export type Externals = WebpackOptionsNormalized['externals'] | any;
export type Performance = WebpackOptionsNormalized['performance'] | any;
export type Node = Configuration['node'] | any;

export interface CustomedWebpackConfigs extends Configuration {
  devServer?: DevServer;
}

export type DllEntryMap = Record<string, string[]> | false | undefined | null | 0;

export interface ParamsGetWebpackChainConfigs {
  projectPath: string;
  pageName: string;
  publicPath?: string;
  fePort?: number;
  dllEntryMap?: DllEntryMap;
}