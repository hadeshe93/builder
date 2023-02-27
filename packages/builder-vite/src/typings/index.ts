import type { ProjectConfig as BaseProjectConfig, BuilderConfig } from '@hadeshe93/builder-core';
import type ViteChain from '@hadeshe93/vite-chain';

export type ProjectMiddleware = [string, any?] | [(...args: any[]) => (chainConfig: ViteChain) => ViteChain, any?];
export type ProjectMiddlewares = ProjectMiddleware[];
export interface ProjectConfig extends BaseProjectConfig {
  middlewares: ProjectMiddlewares;
};

export interface GetConfigGettersOptions {
  builderConfig: BuilderConfig;
  envConfig: {
    assetsPath: string;
  };
}