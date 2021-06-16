const ora = require('ora');

async function sleep(time){
  return new Promise((resolve)=>{
    setTimeout(resolve,time)
  })
}

// 为网络请求包装loading
async function wrapLoading(fn, message, times){
    const spinner  = ora(message);
    spinner.start();
    try{
      const res  = await fn();
      spinner.succeed();
      return res;
    }catch(err){
      if(times++>5){
        spinner.fail('request failed, please check your network');
        return;
      }
      spinner.fail('request failed, refetch...');
      await sleep(3000);
      wrapLoading(fn, message, times);
    }
}

module.exports = {
  wrapLoading
};