// 获取最大的id值，也就是插入数据的id值
function getMaxId(allArticleComment){
    console.log(allArticleComment);
    const idList=allArticleComment.map(item=>{
        return item.id
    })
    idList.sort((a,b)=>{
        return b-a
    })
    console.log(idList[0]);
    return idList[0]
    
  }
export default getMaxId