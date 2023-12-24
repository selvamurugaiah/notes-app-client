import {configureStore} from "@reduxjs/toolkit";
import usersReducer from '../slices/users/userSlices'
import noteListReducer from "../slices/notes/notesSlices";


const store = configureStore({
    reducer:{
        users:usersReducer,
        noteList : noteListReducer
   
    },
})



export default store