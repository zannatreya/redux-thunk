const { createStore, applyMiddleware } = require("redux");
const reduxThunk = require("redux-thunk").default;
const { default: axios } = require("axios");

const GET_TODOS_REQUEST = "GET_TODOS_REQUEST";
const GET_TODOS_SUCCESS = "GET_TODOS_SUCCESS";
const GET_TODOS_FAILED = "GET_TODOS_FAILED";
const TODOS_URL = "https://jsonplaceholder.typicode.com/todos";


const initialTodosState={
    todos: [],
    isLoading: false,
    error: null,
};

const getTodosRequest=()=>{
    return{
        type: GET_TODOS_REQUEST,
    };
};
const getTodosSuccess=(todos)=>{
    return{
        type: GET_TODOS_SUCCESS,
        payload: todos,
    };
};
const getTodosFailed=(error)=>{
    return{
        type: GET_TODOS_FAILED,
        payload: error,
    };
};

const todosReducer = (state=initialTodosState,action)=>{
    switch (action.type) {
        case GET_TODOS_REQUEST:
            return{
                ...state,
                isLoading: true,
            };
        case GET_TODOS_SUCCESS:
            return{
                ...state,
                todos: action.payload,
                isLoading: false,
            };
        case GET_TODOS_FAILED:
            return{
                ...state,
                error: action.payload,
                isLoading: false,
            };
            
    
        default:
            state;
    }
};

const fetchData = () => {
    return (dispatch) => {
        dispatch(getTodosRequest());
        axios
        .get(TODOS_URL)
        .then(res=>{
            const todos = res.data;
            const titles = todos.map(todo=> todo.title);
            dispatch(getTodosSuccess(titles));
        })
        .catch(err=>{
            const error = err.message;
            dispatch(getTodosFailed(error));
        });
    };
};

const store = createStore(todosReducer,applyMiddleware(reduxThunk));
store.subscribe(()=>{
    console.log(store.getState());
});

store.dispatch(fetchData());