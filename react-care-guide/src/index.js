import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ConnectApp from './components/App';
import store from './store';

// render the App component wrapped with a Provider component to give it access to the redux store
ReactDOM.render(<Provider store={store}><ConnectApp /></Provider>, document.getElementById('root'));
