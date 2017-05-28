import defaultState from '../default-state';

function Interactive (state = defaultState.Interactive, {type}) {
  switch (type) {
    case 'GAME_STARTED':
      return true;

    case 'GAME_FINISHED':
      return false;

    case 'CARD_RESET_SOON':
      return false;

    case 'CARD_REMOVE_SOON':
      return false;

    case 'CARD_RESET':
      return true;

    case 'CARD_REMOVE':
      return true;

    case 'RESET_ALL':
      return defaultState.Interactive;

    default:
      return state;
  }
}

export default Interactive;
