import { useDispatch, useSelector } from "react-redux";
import TopbarSection from "./__sections/topbar-section";
import store from "@/app/store/store";
import { get_app_data_thunk } from "@/app/redux/app-thunk";
import { useEffect, useState } from "react";
import SidebarSection from "./__sections/sidebar-section";
import AskAiSection from "./__sections/ask-ai-section";
import LoadingPage from "@/app/_components/loading-page";
import { setLoading } from "@/app/redux/app-slice";

export default function Layout({ children }) {
    const { desktopCollapsed, loading } = useSelector((store) => store.app);
    const dispatch = useDispatch()
    useEffect(() => {
        async function get_data(params) {
            try {
                await store.dispatch(get_app_data_thunk());
                dispatch(setLoading(false))
            } catch (error) {
                dispatch(setLoading(false))
            }
        }
        get_data()
    }, []);
    return (
        <div className="h-full">
            <SidebarSection />
            <div
                className={`${desktopCollapsed ? "" : "lg:pl-72"
                    } flex flex-col min-h-screen transition-all duration-300`}
            >
                <TopbarSection />
                <main
                    className={`flex-1${desktopCollapsed ? "ml-20" : ""
                        }`}
                >
                    {/* Added the animation wrapper here */}
                    <div className="animate-slideUp p-4">
                        {/* {
                            loading ? <LoadingPage /> : children
                        } */}
                        {children}
                    </div>
                </main>
            </div>
            <AskAiSection />
        </div>
    );
}