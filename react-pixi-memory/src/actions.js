/* LoadImageList function creates an IMAGE_LIST_LOAD action, which triggers
 * the Pixabay API request.
 * param searchterm: (String) URL-encoded search term for the Pixabay API
 */
export function LoadImageList(searchterm) {
  return {
    type: 'IMAGE_LIST_LOAD',
    payload: {
      searchterm
    }
  }
}

/* SelectCard function creates a CARD_SELECT action, which marks a card
 * as flipped in the store.
 * param index: (Number) array position of the selected card
 */
export function SelectCard(index) {
  return {
    type: 'CARD_SELECT',
    payload: {
      index
    }
  }
}

/* ResetCards function creates a CARD_RESET_SOON action, which sets all
 * cards in the store to not flipped after a short delay
 */
export function ResetCards() {
  return {
    type: 'CARD_RESET_SOON'
  }
}

/* RemoveCards function creates a CARD_REMOVE_SOON action, which, after a short
 * delay, marks all flipped cards in the store so that their associated components
 * will trigger their fade animations
 */
export function RemoveCards() {
  return {
    type: 'CARD_REMOVE_SOON'
  }
}

/* RemoveCard function creates a CARD_REMOVED action, which marks a given card so
 * that its component will unmount; called after a card component's fade animation
 * has completed.
 * param index: (Number) array position of the card to unmount
 */
export function RemoveCard(index) {
  return {
    type: 'CARD_REMOVED',
    payload: {
      index
    }
  }
}

/* SetCardImage function creates a CARD_IMAGE_SET action, which assigns an image to
 * a specific card
 * param index: (Number) array position of the card to modify
 * param id: (Number) Pixabay image id
 * param previewURL: (String) image url, comes from Pixabay API previewURL property
 */
export function SetCardImage(index, id, previewURL) {
  return {
    type: 'CARD_IMAGE_SET',
    payload: {
      index,
      id,
      previewURL
    }
  }
}

/* StartGame function creates a GAME_STARTED action, which updates the game Status
 * to playing.
 */
export function StartGame() {
  return {
    type: 'GAME_STARTED'
  }
}

/* FinishGame function creates a GAME_FINISH action, which updates the game Status
 * to finished.
 */
export function FinishGame() {
  return {
    type: 'GAME_FINISH'
  }
}

/* ResetAll function creates a RESET_ALL action, which resets the store to the defaultState
 * for initializing a new game.
 */
export function ResetAll() {
  return {
    type: 'RESET_ALL'
  }
}

/* Tick function creates a TICK action, for propagating animation frame updates, implemented
 * as a boolean that toggles state with each tick
 */
export function Tick() {
  return {
    type: 'TICK'
  }
}
