export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      }
    case "SET_HASHTAGS":
      return {
        ...state,
        hashTags: action.payload,
        loading: false
      };
    case "RESET_HASHTAG": {
      const updatedHashtags = [...state.hashTags];
      updatedHashtags[updatedHashtags.findIndex(i => i.hashTag === action.payload.hashTag)].latestId = 0;
      return {
        ...state,
        hashTags: updatedHashtags,
        loading: false
      }
    };
    case "DELETE_HASHTAG":
      const index = state.hashTags.findIndex(i => i.hashTag === action.payload.hashTag);
      const updatedHashtags = [
        ...state.hashTags.slice(0, index),
        ...state.hashTags.slice(index + 1)
      ];
      return {
        ...state,
        hashTags: updatedHashtags,
        loading: false
      };
    default:
      return state;
  }
}