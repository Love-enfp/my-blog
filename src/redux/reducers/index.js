import { combineReducers } from "redux";

import articles from './articles'

const rootReducer=combineReducers({
    // 此层为最外面一层
    articles
})


export default rootReducer

