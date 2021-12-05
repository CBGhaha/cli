const axios = require('axios');
axios.interceptors.response.use(res=>{
    return res.data;
})

async function fetchTagList(){
    return axios.get('https://api.github.com/repos/CBGhaha/baas-component/tags')
}
async function fetchRepoList(){

}
module.exports = {
    fetchTagList
}