A core abstract builder for adapting different builders.

## Installation

```sh
# install builder-core
$ npm install @hadeshe93/builder-core --save-dev

# install builder-webpack or other builders
$ npm install @hadeshe93/builder-webpack --save-dev
```

## Usage

```js
import BuilderCore from '@hadeshe93/builder-core';
import BuilderWebpack from '@hadeshe93/builder-webpack';

// initialize builder
const builder = new BuilderCore({});
// initialize webpackBuilder
const webpackBuilder = new BuilderWebpack();

// register
builder.registerBuilder('webpack', webpackBuilder);

// create excutore
const excute = builder.createExcutor({
  mode: 'development',
  builderName: 'webpack',
  appProjectConfig: {
    projectPath: '/path/to/xx',
    pageName: 'demo1',
    // optional
    middlewares: [
      // middleware and params
      // actually, @hadeshe93/wpconfig-mw-vue3 doesn`t need params. just for example
      ['@hadeshe93/wpconfig-mw-vue3', {}]
    ],
    page: {
      title: 'Show',
      description: '',
      useFlexible: true,
      useDebugger: true,
    },
    build: {
      fePort: 3000,
      publicPath: '/',
    },
  }
});

async function someOperation() {
  // apply excutor in appropriate time
  await excute();
}
```