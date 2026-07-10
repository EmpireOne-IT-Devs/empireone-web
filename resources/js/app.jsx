import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";

import store from "./app/store/store";
import Alert from "./app/_components/alert";

const appName = import.meta.env.VITE_APP_NAME || "EmpireOneCX | Customer Experience & Global Outsourcing Services";

/* -------------------------------------------------
 * Global UI Wrapper (Redux-aware)
 * ------------------------------------------------ */
function AppShell({ App, props }) {
    const { alert } = useSelector((state) => state.app);

    return (
        <>
            <Alert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                open={alert.open}
            />
            <App {...props} />
        </>
    );
}

createInertiaApp({
    title: (title) => `${title} ${appName}`,

    resolve: (name) =>
        resolvePageComponent(
            `./app/pages/${name}.jsx`,
            import.meta.glob("./app/pages/**/*.jsx")
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <AppShell App={App} props={props} />
            </Provider>
        );
    },

    progress: {
        color: "#4B5563",
    },
});
