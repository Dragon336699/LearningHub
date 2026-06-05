import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import "./global.css";
import { store } from "./store/index";
import { router } from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <Toaster 
                    position="top-right" 
                    reverseOrder={false}
                />
                <RouterProvider router={router} />
            </Provider>
        </QueryClientProvider>
    </StrictMode>
);