const path  = require('path');
const fs =  require('fs-extra');
const inquirer = require('inquirer');
const Creator = require('./Creator');

module.exports = async function(name, args){

  const cwd  = process.cwd();// 获取当前命令执行时的工作目录
  const targetDir = path.join(cwd, name);
 
  // 如果当前已经存在同名项目
  if(fs.existsSync(targetDir)){
    if(args.force){
      await fs.remove(targetDir);
    }else{
      // 提示用户是否需要覆盖
    const {action} =  await inquirer.prompt([ // 配置询问的方式
      {
        name:'action',
        type:'list',
        message:'target directory already exisis, Pick an action',
        choices:[
          {name: 'Overwrite', value: 'overwrite'},
          {name:'Cancel', value: 'cancel'},
        ]
      }
     ])
     if(action === 'cancel'){
        return
     } else {
      console.log('removeing');
      await fs.remove(targetDir);
      console.log('remove success');
     }
    }
  }
   
  const creator = new Creator(name, targetDir);
  creator.create();
}