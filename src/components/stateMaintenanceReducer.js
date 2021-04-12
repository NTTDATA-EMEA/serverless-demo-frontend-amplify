export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      }
    case "ADD_HASHTAG": {
      const updatedHashtags = [action.payload, ...state.hashTags];
      return {
        ...state,
        hashTags: updatedHashtags,
        isDirty: true
      }
    }
    case "SET_HASHTAGS":
      return {
        ...state,
        hashTags: action.payload,
        loading: false,
        isDirty: false
      };
    case "RESET_HASHTAG": {
      const updatedHashtags = [...state.hashTags];
      updatedHashtags[updatedHashtags.findIndex(i => i.hashTag === action.payload.hashTag)].latestId = 0;
      return {
        ...state,
        hashTags: updatedHashtags,
        isDirty: true
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
        isDirty: true
      };
    case "SET_INPUT":
      return {
        ...state,
        form: { hashTag: action.payload, latestId: 0 },
        isDirty: false
      }
    case "RESET_INPUT":
      return {
        ...state,
        form: { hashTag: '', latestId: 0 },
        isDirty: false
      }
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isDirty: false
      }
    default:
      throw new Error(`Unknow action type: ${action.type}`);
  }
}