export type SupportedBuilderNames = 'webpack' | 'vite' | string;
export type SupportedBuilderMode = 'development' | 'production' | string;
export type SupportedBuilderInsMap = Map<SupportedBuilderNames, any>;

// 项目配置
export interface ProjectConfig {
  // 页面能力相关的配置
  page?: {
    // 页面标题
    title?: string;
    // 页面描述
    description?: string;
    // 页面注入：
    useInjection?: {
      // 是否使用 debugger，正式环境中应关闭
      debugger?: boolean;
      // 是否使用响应式像素
      flexible?: boolean;
      // 是否使用默认的首屏测速脚本
      pageSpeedTester?: boolean;
    };
    // 使用响应式像素时配置 pxtorem 插件
    pxtoremOptions?: {
      rootValue?: number;
      unitPrecision?: number;
      propList?: string[];
      selectorBlackList?: string[];
      replace?: boolean;
      mediaQuery?: boolean;
      minPixelValue?: number;
      exclude?: RegExp;
    } | undefined | false;
  };
  // 构建相关的配置
  build?: {
    // 开发服务器端口
    devPort?: number;
    // 页面引用的公共静态资源路径
    publicPath?: string;
    dllEntryMap?: Record<string, string[]> | false | undefined | null | 0;
  };
  // 处理配置的中间件，它的功能更类似与中间件，加工处理完继续返回给下一个处理
  middlewares?: ProjectMiddlewares;
}

export type AnyFunction = (...args: any[]) => any;
export type ProjectMiddleware = [string, ...any[]] | [AnyFunction, ...any[]];
export type ProjectMiddlewares = ProjectMiddleware[];

export interface BuilderConfig {
  // 构建模式
  mode: SupportedBuilderMode;
  // 构建器名称
  builderName: SupportedBuilderNames;
  // 项目路径
  projectPath: string;
  // 目标页面名称
  pageName: string;
  // 项目配置
  projectConfig: ProjectConfig | GetProjectConfig;
}
export interface PureBuilderConfig extends BuilderConfig {
  projectConfig: ProjectConfig;
}

export type BuildOrderType = 'serial' | 'parallel';

export interface BundledStringResult {
  string: string;
  originalResult: any;
}

export interface GetProjectConfigOptions {
  mode: string;
  builderName: string;
}

export type GetProjectConfig<T extends ProjectConfig = ProjectConfig> = (options: GetProjectConfigOptions) => T | Promise<T>;