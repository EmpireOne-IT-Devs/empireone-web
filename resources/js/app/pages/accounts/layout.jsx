import { useDispatch, useSelector } from "react-redux";
import TopbarSection from "./__sections/topbar-section";
import store from "@/app/store/store";
import { get_app_data_thunk } from "@/app/redux/app-thunk";
import { useEffect } from "react";
import SidebarSection from "./__sections/sidebar-section";
import AskAiSection from "./__sections/ask-ai-section";
import LoadingPage from "@/app/_components/loading-page";
import { setLoading } from "@/app/redux/app-slice";

export default function Layout({ children }) {
    const { desktopCollapsed, loading } = useSelector((store) => store.app);
    const dispatch = useDispatch();

    useEffect(() => {
        async function get_data() {
            try {
                if (loading) {
                    await store.dispatch(get_app_data_thunk());
                    dispatch(setLoading(false));
                }
            } catch (error) {
                dispatch(setLoading(false));
            }
        }
        get_data();
    }, [dispatch, loading]);

    return (
        <div className="h-full">
            {loading ? (
                <LoadingPage />
            ) : (
                <>
                    <SidebarSection />
                    <div
                        className={`${
                            desktopCollapsed ? "lg:pl-16" : "lg:pl-64"
                        } flex flex-col min-h-screen transition-all duration-300`}
                    >
                        <TopbarSection />
                        <main className="flex-1 min-w-0">
                            <div className="animate-slideUp p-4">
                                {children}
                            </div>
                        </main>
                    </div>
                    <AskAiSection />
                </>
            )}
        </div>
    );
}
