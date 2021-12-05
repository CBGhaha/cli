const rollup = require('rollup');
const ora = require('ora');
const chalk = require('chalk');

module.exports = function(){
  try{
  
    const config = require(`../rollup.config.js`);
    const promiseTasks =  config.map(inputOptions=>{
      return new Promise(async (resolve, reject)=>{
        try{
          const bundle = await rollup.rollup(inputOptions);
          const { code, map } = await bundle.generate(inputOptions.output);
          await bundle.write(inputOptions.output);
          resolve(inputOptions.output.file);
        }catch(err){
          console.log(err);
          reject(false);
        }
      })
    })
    const spinner  = ora('build start');
    spinner.start();
    Promise.all(promiseTasks).then((res)=>{
      spinner.succeed();
      console.log(chalk.green('build success, output files:\n', res.join('\n')))
    }).catch(err=>{
      spinner.fail('request failed, please try again', err);
    })
  }catch(err){
    console.log(err)
  }
  
}