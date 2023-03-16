import type { ProjectConfig as BaseProjectConfig, BuilderConfig as BaseBuilderConfig } from '@hadeshe93/builder-core';
import type WebpackChain from 'webpack-chain';

export type ProjectMiddleware = [string, any?] | [(...args: any[]) => (chainConfig: WebpackChain) => WebpackChain, any?];
export type ProjectMiddlewares = ProjectMiddleware[];
export interface ProjectConfig extends BaseProjectConfig {
  middlewares: ProjectMiddlewares;
};
export interface BuilderConfig extends BaseBuilderConfig {
  projectConfig: ProjectConfig;
}