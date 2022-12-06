import { INIT_ARTICLES,GIVE_LIKE } from "../constants";

// defaultState为默认的articles值
const defaultState= []

// state为初始的数值，action中包含传递过来的参数
const articles=(state=defaultState,action)=>{
    switch (action.type) {
        // 初始化获得所有文章
        case INIT_ARTICLES:
            return action.articles
            
        // 点赞，增加Like
        case GIVE_LIKE:
            let currentId=state.findIndex((item)=>{return item.id===action.id})
            // 直接对原始的值进行修改
            state[currentId].like++
            return state
                
        
        default:
           return state;
    }

}

export default articles