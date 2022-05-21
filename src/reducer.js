function songReducer(state, action) {
  switch (action.type) {
    case "DELETE_SONG": {
      return {
        ...state,
      };
    }

    case "SET_SONG": {
      return {
        ...state,
        song: action.payload.song,
      };
    }

    case "PLAY_SONG": {
      return {
        ...state,
        // song: action.payload.song,
        isPlaying: true,
      };
    }

    case "PAUSE_SONG": {
      return {
        ...state,
        // song: action.payload.song,
        isPlaying: false,
      };
    }

    default:
      return { ...state };
  }
}

export default songReducer;
