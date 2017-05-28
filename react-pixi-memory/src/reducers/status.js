import defaultState from '../default-state';

function Status (state = defaultState.Status, {type}) {
  switch (type) {
    case 'IMAGE_LIST_LOAD':
      return 'loadingimages';
      
    case 'IMAGE_LIST_LOADED':
      return 'createboard';

    case 'CARD_IMAGE_SET':
      return 'creatingboard';

    case 'GAME_STARTED':
      return 'playing';

    case 'GAME_FINISHED':
      return 'finished';

    case 'RESET_ALL':
      return defaultState.Status;

    default:
      return state;
  }
}

export default Status;
