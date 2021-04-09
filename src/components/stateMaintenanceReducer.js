export const reducer = (state, action) => {
    switch(action.type) {
        case "SET_HASHTAGS":
            return {
                ...state,
                hashTags: action.payload,
                loading: false
            };
        case "RESET_HASHTAG":
            return {
                ...state,
                hashTags: action.payload,
                loading: false
            };
        case "DELETE_HASHTAG": 
            return {
                ...state,
                hashTags: action.payload,
                loading: false
            };
        default:
            return state;
    }
}