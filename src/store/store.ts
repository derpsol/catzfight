import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/game-slice";
import messagesReducer from "./slices/messages-slice";

const store = configureStore({
    reducer: {
        app: appReducer,
        messages: messagesReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
