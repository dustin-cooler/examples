/* buildDefaultState function returns a defaultState object for the redux store
 */
const buildDefaultState = () => {
  const template = {
    Cards: [],
    Turns: 0,
    Images: [],
    Status: 'new',
    Interactive: false,
    Ticked: false
  }

  // create 16 card objects with their positions
  // set in a 4x4 grid
  for (let row = 1; row < 5; row++) {
    for (let col = 1; col < 5; col++) {
      let card = {
        x: col * 100 - 50,
        y: row * 100 - 50,
        imageId: null,
        imageUrl: null,
        remove: false,
        visible: false,
        flipped: false
      }
      template.Cards.push(card);
    }
  }
  return template;
}

const defaultState = buildDefaultState();

export default defaultState;
