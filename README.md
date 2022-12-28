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

## 提交及发布流程

各个包各自按正常流程提交修改，然后在根目录分别先后执行：

```bash
# 选择有变更的包，触发出变更文件以便标记
$ pnpm run changeset

# 提升包版本
$ pnpm run version

# 提交并推送变更到远程仓库以触发构建流水线
$ git a . && git c -m 'xxx' && git push origin main
```