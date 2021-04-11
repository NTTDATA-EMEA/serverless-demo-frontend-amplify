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
        hashTags: updatedHashtags
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
        hashTags: updatedHashtags
      };
    case "SET_INPUT":
      return {
        ...state,
        form: { hashTag: action.payload, latestId: 0 }
      }
    case "RESET_INPUT":
      return {
        ...state,
        form: { hashTag: '', latestId: 0 }
      }
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      throw new Error(`Unknow action type: ${action.type}`);
  }
}