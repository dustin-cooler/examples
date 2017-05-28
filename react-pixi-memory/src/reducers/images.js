import defaultState from '../default-state';

function Images (state = defaultState.Images, {type, payload}) {
  switch (type) {
    case 'IMAGE_LIST_LOADED':
      let Images = [];
      payload.images.map(({ previewHeight, id, previewURL }) => {
        if (previewHeight >= 80) {
          Images.push({
            id,
            previewURL
          });
        }
      });
      return Images;
    case 'RESET_ALL':
      return defaultState.Images;
      
    default:
      return state;
  }
}

export default Images;
