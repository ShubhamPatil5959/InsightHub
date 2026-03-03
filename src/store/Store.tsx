import { configureStore } from "@reduxjs/toolkit";
import {
    authReducer,
    dashboardReducer,
    usersReducer,
    watchlistReducer,
    portfolioReducer,
} from "../features";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        users: usersReducer,
        watchlist: watchlistReducer,
        portfolio: portfolioReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;