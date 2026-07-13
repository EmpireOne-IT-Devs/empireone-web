
import { useDispatch } from "react-redux";
import { delete_engagement_post_thunk } from "@/app/redux/engagement-slice";
import { setAlert } from "@/app/redux/app-slice";

export function DeletePostSection() {
    const dispatch = useDispatch();

    const handleDelete = async (id) => {
        const result = await dispatch(delete_engagement_post_thunk(id));
        if (delete_engagement_post_thunk.fulfilled.match(result)) {
            dispatch(
                setAlert({
                    type: "success",
                    title: "Post deleted successfully!",
                    open: true,
                }),
            );
            return true;
        } else {
            dispatch(
                setAlert({
                    type: "error",
                    title: "Failed to delete post",
                    open: true,
                }),
            );
            return false;
        }
    };

    return { handleDelete };
}