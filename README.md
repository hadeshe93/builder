`@hadeshe93/builder` 这个 monorepo 仓库是旨在将构建相关的配置、工具分层封装成包进行发布，从不同层次和生态的角度为用户（当前仅有自己）提供不同定位、粒度和角度的工具包。

## 包定位及能力

```
├── packages
│   ├── builder-core // builder 核心抽象层，抽象 builder 应用的能力
│   ├── builder-webpack // webpack builder
│   ├── wpconfig-core // 产出 webpack 配置的核心包
│   ├── wpconfig-mw-react17 // 辅助产出 react17 相关配置的中间件包
│   └── wpconfig-mw-vue3 // 辅助产出 vue3 相关配置的中间件包
```