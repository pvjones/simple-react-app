import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

console.log('App', App)
console.log('<App />', <App />)

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
