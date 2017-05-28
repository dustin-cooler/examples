import { combineReducers } from 'redux';

import Cards from './cards';
import Images from './images';
import Interactive from './interactive'
import Status from './status';
import Ticked from './ticked';
import Turns from './turns';

const RootReducer = combineReducers({
  Cards,
  Images,
  Interactive,
  Status,
  Ticked,
  Turns
});

export default RootReducer;
