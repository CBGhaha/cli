// rollup的配置

const jsonPlugin = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
// import resolvePlugin from '@rollup/plugin-node-resolve';
const tsPlugin = require('rollup-plugin-typescript2');
const babel = require('rollup-plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const image = require('@rollup/plugin-image');
const vue = require('rollup-plugin-vue2');
const replace = require('@rollup/plugin-replace');
const externalGlobals = require('rollup-plugin-external-globals');
// import vue3 from 'rollup-plugin-vue';
// import postcssModules from 'postcss-modules';
const nested = require('postcss-nested');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const { terser } = require('rollup-plugin-terser');

const path = require('path');

// 根据环境变量中的target属性 获取对应模版中的package.json
const cwd  = process.cwd();// 获取当前命令执行时的工作目录
const packageDir = cwd;

const resolve = (file)=>{return path.resolve(packageDir, file);};

const pkg = require(resolve('package.json'));
// const packageName = path.basename(packageDir); //去文件名

// 对打包类型先做一个映射表，根据你提供的formats来格式化需要打包的内容
const outputConfig = {
  'esm-bundler': {
    file: resolve('./dist/index.esm.js'),
    format: 'es'
  },
  'cjs': {
    file: resolve('./dist/index.cjs.js'),
    format: 'cjs'
  },
  'global': {
    file: resolve('./dist/index.global.js'),
    format: 'iife' // 立即执行函数
  }
};
// return;
let { buildOptions: { formats, name }, devDependencies, dependencies } = pkg;
formats = formats.filter((i)=>{
  return !(process.env.NODE_ENV === 'development' && i === 'global');
});

let extensions = ['react', 'react-dom'];

let vueVersion = '';
[devDependencies, dependencies].forEach(dependent=>{
  try {
    if (dependent) {
      const paks = Object.keys(dependent);
      const vue = paks.find(i=>i === 'vue');
      if (vue) {
        vueVersion = dependent.vue.match(/\d{1}/)[0];
      }
      extensions = [...extensions, ...paks];
    }
  } catch (err) {
    console.log(err);
  }

});

function createConfig(format, output) {
  output.name = name;
  output.sourcemap = true; //生成sourcemap
  return {
    input: resolve('./src/index.js'),
    output,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      jsonPlugin(),
      image(),
      vueVersion && vue({
        css: true,
        compileTemplate: true
      }),
      postcss({
        plugins: [
          nested(),
          postcssPresetEnv(),
          cssnano()
          // postcssModules()
        ],
        extensions: ['.css', 'less'],
        use: [['less', {
          javascriptEnabled: true
        }]]
        // modules: true
      }),
      tsPlugin({
        tsconfig: path.resolve(__dirname, './tsconfig.json')
      }),
      babel({
        exclude: '**/node_modules/**',
        runtimeHelpers: true,
        extensions: ['js', 'ts', 'jsx', 'vue']
      }),
      commonjs(),
      nodeResolve(),
      externalGlobals({
        jquery: '$',
        vue: 'Vue'
      }),
      terser()
    ],
    external: format !== 'global' ? extensions : false

  };

}
module.exports = formats.map(format=>createConfig(format, outputConfig[format]));

