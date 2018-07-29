import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import {Provider} from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import store from './store';

const root = <Provider store={store}>
  <App />
</Provider>

ReactDOM.render(
  root,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();


// const fetchJSON = (url: string, data: {tickCount: number}) => {
//   return fetch(url, {
//     body: JSON.stringify(data),
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'post',
//   }).then(r => r.json())
// }

// fetchJSON('/fn/pong/gameTick', {tickCount: 0}).then(r => console.log('resp', r))
