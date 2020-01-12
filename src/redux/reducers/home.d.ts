import * as actionTypes from '../constants/actionTypes'
export const home = (state={
    userdata:{},
    url:false,
},action:any) => {
    switch (action.type){
        case actionTypes.USER_LOGIN:
            return {
                ...state,
            };
        case actionTypes.SAVE_USERDATA:
            return {
                ...state,
                userdata:{...action.data}
            };
  
        case actionTypes.UPDATA_isEdit:
            return {
                ...state,
                userdata:{...state.userdata,isEdit:1}
            };
    

        default:
            return state;
    }
}




