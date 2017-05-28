import defaultState from '../default-state';

function Cards (state = defaultState.Cards, {type, payload}) {
  let cards;
  switch (type) {
    case 'CARD_SELECT':
      cards = state.slice(0);
      cards[payload.index] = Object.assign({}, cards[payload.index], {flipped: true});
      return cards;

    case 'CARD_IMAGE_SET':
      cards = state.slice(0);
      cards[payload.index] = Object.assign({}, cards[payload.index], {imageId: payload.id, imageUrl: payload.previewURL, visible: true});
      return cards;

    case 'CARD_RESET':
      cards = state.slice(0);
      return cards.map((card) => {
        return Object.assign({}, card, {flipped: false});
      });

    case 'CARD_REMOVE':
      cards = state.slice(0);
      return cards.map((card) => {
        return Object.assign({}, card, {flipped: false, remove: card.flipped});
      });

    case 'CARD_REMOVED':
      cards = state.slice(0);
      cards[payload.index] = Object.assign({}, cards[payload.index], {visible: false});
      return cards;

    case 'RESET_ALL':
      return defaultState.Cards;

    default:
      return state;
  }
}

export default Cards;
