import { combineReducers } from "redux";

import articles from './articles'
import comments from "./comment";
const rootReducer=combineReducers({
    // 此层为最外面一层
    articles,
    comments
})


export default rootReducer

