const rollup = require('rollup');
const ora = require('ora');
const chalk = require('chalk');

module.exports = function(){
  try{
    const cwd  = process.cwd();// 获取当前命令执行时的工作目录
    const config = require(`${cwd}/rollup.config.js`);
    const promiseTasks =  config.map(inputOptions=>{
      return new Promise(async (resolve, reject)=>{
        try{
          const watcher = rollup.watch(inputOptions);
          watcher.on('event', event => {
            if(event.code==='END'){
              resolve(inputOptions.output.file);
            }
          });
          
        }catch(err){
          reject(false);
        }
      })
    })
    const spinner  = ora('build start');
    spinner.start();
    Promise.all(promiseTasks).then((res)=>{
      spinner.succeed();
      console.log(chalk.green('build success, watch change' ))
    }).catch(err=>{
      spinner.fail('request failed, please try again', err);
    })
  }catch(err){
    console.log(err)
  }
  
}