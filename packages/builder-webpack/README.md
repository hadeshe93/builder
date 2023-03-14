A core abstract builder for adapting different builders.

## Installation

```sh
# install builder-core
$ npm install @hadeshe93/builder-core --save-dev

# install builder-webpack or other builders
$ npm install @hadeshe93/builder-webpack --save-dev
```

## Usage

### Use it alone

```js
import BuilderCore from '@hadeshe93/builder-core';
import BuilderWebpack from '@hadeshe93/builder-webpack';

// initialize webpackBuilder
const webpackBuilder = new BuilderWebpack();

// create excutore
const excute = function (webpackBuilder) {
  return webpackBuilder.start({
    mode: 'development',
    builderName: 'webpack',
    projectPath: '/path/to/xx',
    pageName: 'demo1',
    projectConfig: {
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
      middlewares: [
        // middleware and params
        // actually, @hadeshe93/wpconfig-mw-vue3 doesn`t need params. just for example
        ['@hadeshe93/wpconfig-mw-vue3', {}]
      ],
    }
  })
};

async function someOperation() {
  // apply excutor in appropriate time
  await excute();
}
```

### Use it with @hadeshe93/builder-core

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
  projectPath: '/path/to/xx',
  pageName: 'demo1',
  projectConfig: {
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
    middlewares: [
      // middleware and params
      // actually, @hadeshe93/wpconfig-mw-vue3 doesn`t need params. just for example
      ['@hadeshe93/wpconfig-mw-vue3', {}]
    ],
  }
});

async function someOperation() {
  // apply excutor in appropriate time
  await excute();
}
```