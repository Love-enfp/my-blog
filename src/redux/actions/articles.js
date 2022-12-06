import { INIT_ARTICLES ,GIVE_LIKE} from "../constants";


export const initCity=(articles)=> ({type:INIT_ARTICLES,articles})

export const giveLike=(id)=> ({type:GIVE_LIKE,id})
