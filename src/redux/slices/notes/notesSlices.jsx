import axios from 'axios';

// Note List ActionTypes


const POST_NOTE_REQUEST = 'note/post/request';
const POST_NOTE_SUCCESS = 'note/post/success';
const POST_NOTE_FAILURE = 'note/post/failure';

// Add Note
export const postNoteRequest = () => ({ type: POST_NOTE_REQUEST });
export const postNoteSuccess = (payload) => ({ type: POST_NOTE_SUCCESS, payload });
export const postNoteFailure = (error) => ({ type: POST_NOTE_FAILURE, error });


  // post the data
export const postNote = (noteData) => {
  return async (dispatch, getState) => {
    dispatch(postNoteRequest());

    try {
      const userInfoString = localStorage.getItem('userInfo');
      const token = userInfoString ? JSON.parse(userInfoString).token : null;
      const response = await axios.post('http://localhost:4000/notes/create-note', noteData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(postNoteSuccess(response.data));
    } catch (error) {
      if (!error.response) {
        dispatch(postNoteFailure(error));
      } else {
        dispatch(postNoteFailure(error.response.data));
      }
    }
  };
};



// Reducer
const initialState = {
    noteList: [], 
    loading: false,
    error: undefined,
    posting: false,
    postError: undefined,
   
  };
  

const noteListReducer = (state = initialState, action) => {
  switch (action.type) {
   
    case POST_NOTE_REQUEST:
      return {
        ...state,
        posting: true,
        postError: undefined,
      };
      case POST_NOTE_SUCCESS:
        return {
          ...state,
          posting: false,
          postError: undefined,
          noteList: state.noteList ? [...state.noteList, action.payload] : [action.payload],
        };
      
    case POST_NOTE_FAILURE:
      return {
        ...state,
        posting: false,
        postError: action.error?.message,
      };
   
    default:
      return state;
  }
};

export default noteListReducer;
