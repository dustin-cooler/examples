import fetch from 'isomorphic-fetch';
import { delay } from 'redux-saga';
import { takeEvery, all, put } from 'redux-saga/effects';
import { APIKEY } from './config';

/* fetchImages function fetches 40 most popular photos matching searchterm from the Pixabay API
 * param searchterm: (String) URL-encoded string of search terms
 */
const fetchImages = (searchterm) => fetch(
  'https://pixabay.com/api/?key=' + APIKEY + '&q=' + searchterm + '&image_type=photo&per_page=40'
).then((response) => response.json());

/* loadImages generator function to request a list of images from Pixabay API and handle the response
 * param action: (Object) redux action of type IMAGE_LIST_LOAD
 */
export function* loadImages (action) {
  const response = yield fetchImages(action.payload.searchterm);

  if (response.hits && response.hits.length) {
    yield put({
      type: 'IMAGE_LIST_LOADED',
      payload: {
        images: response.hits
      }
    });
  }
}

/* watchLoadImages generator function watches for IMAGE_LIST_LOAD actions and passes them to loadImages()
 */
export function* watchImagesLoad () {
  yield takeEvery('IMAGE_LIST_LOAD', loadImages);
}

/* removeCards generator function dispatches a CARD_REMOVE action after a delay
 */
export function* removeCards () {
  yield delay(2000);
  yield put({type: 'CARD_REMOVE'});
}

/* watchRemoveCards generator function watches for CARD_REMOVE_SOON actions and passes them to removeCards()
 */
export function* watchRemoveCards () {
  yield takeEvery('CARD_REMOVE_SOON', removeCards);
}

/* resetCards generator function dispatches a CARD_RESET action after a delay
 */
export function* resetCards () {
  yield delay(2000);
  yield put({type: 'CARD_RESET'});
}

/* watchResetCards generator function watches for CARD_RESET_SOON actions and passes them to resetCards()
 */
export function* watchResetCards () {
  yield takeEvery('CARD_RESET_SOON', resetCards);
}

/* removeCards generator function dispatches a GAME_FINISHED action after a delay
 */
export function* finishGame () {
  yield delay(1000);
  yield put({type: 'GAME_FINISHED'});
}

/* watchFinishGame generator function watches for GAME_FINISH actions and passes them to finishGame()
 */
export function* watchFinishGame () {
  yield takeEvery('GAME_FINISH', finishGame);
}

/* RootSaga generator function combines all the watch functions
 */
export default function* RootSaga () {
  yield all([
    watchImagesLoad(),
    watchRemoveCards(),
    watchResetCards(),
    watchFinishGame()
  ]);
}
