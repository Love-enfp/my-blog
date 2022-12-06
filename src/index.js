import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.scss'
// 关联redux数据
import { Provider } from 'react-redux';
import store, {persistor} from './redux/store'

import { PersistGate } from "redux-persist/integration/react";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
     <PersistGate persistor={persistor}>
        <BrowserRouter>
              <App />
        </BrowserRouter>
     </PersistGate>
    
  </Provider>

);

