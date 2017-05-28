import defaultState from '../default-state';

function Ticked (state = defaultState.Ticked, {type}) {
  switch (type) {
    case 'TICK':
      return !state;

    default:
      return state;
  }
}

export default Ticked;
