const { fetchTagList } = require('./request');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const {wrapLoading}  = require('./utils')
const path = require('path')


class Creator{
  constructor(projectName, targetDir){
    this.name = projectName;
    this.target = targetDir;
  }

  async create() {
    // 1）先拉取当前组织下的模版

      // 这里直接获取的固定repo

    // 2）再通过模版找到版本号
    let tag = await this.fetchTag();
    console.log("tag:",tag);
    // 3）下载
    await this.download(tag);
  }

  async fetchRepo() {
    
  }

  async fetchTag() {
    const tags = await wrapLoading(fetchTagList, 'waiting fetch template', 1);
    const {tag} = await inquirer.prompt(
      [{
        name:'tag',
        type:'list',
        message:'select template',
        choices:tags.map(i=>{
          return {
            name: i.name,
            value: i.name,
          }
        })
      }
     ])
    return tag;
  }

  async download(tag){s
    download(`CBGhaha/react-framework#${tag}`, path.resolve(process.cwd(),'./demo'), ()=>{
      console.log('下载成功')
    })
  }
}
module.exports = Creator;