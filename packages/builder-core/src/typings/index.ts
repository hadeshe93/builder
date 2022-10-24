export type SupportedBuilderNames = 'webpack' | 'vite';
export type SupportedBuilderMode = 'development' | 'production';
export type SupportedBuilderInsMap = Map<SupportedBuilderNames, any>;

export interface ProjectConfig {
  page: {
    title?: string;
    description?: string;
    useFlexible?: boolean;
    useDebugger?: boolean;
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

  build: {
    fePort?: number;
    publicPath?: string;
    dllEntryMap?: Record<string, string[]> | false | undefined | null | 0;
  };
}

export type AppProjectMiddleware = [string, any?] | [(...args: any[]) => any, any?];
export type AppProjectMiddlewares = AppProjectMiddleware[];

export interface AppProjectConfig extends ProjectConfig {
  projectPath: string;
  pageName: string;
  // 处理配置的中间件，它的功能更类似与中间件，加工处理完继续返回给下一个处理
  middlewares: AppProjectMiddlewares;
}

export interface BuilderConfig {
  mode: SupportedBuilderMode;
  builderName: SupportedBuilderNames;
  appProjectConfig: AppProjectConfig;
}

export type BuildOrderType = 'serial' | 'parallel';