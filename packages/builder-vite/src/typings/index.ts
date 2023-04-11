import type { ProjectConfig as BaseProjectConfig, BuilderConfig as BaseBuilderConfig, GetProjectConfigOptions } from '@hadeshe93/builder-core';
import type ViteChain from '@hadeshe93/vite-chain';

export type ProjectMiddleware = [string, any?] | [(...args: any[]) => (chainConfig: ViteChain) => ViteChain, any?];
export type ProjectMiddlewares = ProjectMiddleware[];
export interface ProjectConfig extends BaseProjectConfig {
  middlewares: ProjectMiddlewares;
};

export interface BuilderConfig extends BaseBuilderConfig {
  projectConfig: ProjectConfig | GetProjectConfig;
}
export interface PureBuilderConfig extends BuilderConfig {
  projectConfig: ProjectConfig;
}

export interface GetConfigGettersOptions {
  builderConfig: PureBuilderConfig;
}

export type GetProjectConfig = (options: GetProjectConfigOptions) => ProjectConfig | Promise<ProjectConfig>;