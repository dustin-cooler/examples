import defaultState from '../default-state';

function Turns (state = defaultState.Turns, {type}) {
  switch (type) {
    case 'CARD_SELECT':
      return state + 1;

    case 'RESET_ALL':
      return defaultState.Turns;

    default:
      return state;
  }
}

export default Turns;
