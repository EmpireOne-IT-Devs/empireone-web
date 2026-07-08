import { useDispatch } from "react-redux";
import { delete_activity_post_thunk } from "@/app/redux/activities-thunk";
import { setAlert } from "@/app/redux/app-slice";

export function DeletePostSection() {
    const dispatch = useDispatch();

    const handleDelete = async (id) => {
        const result = await dispatch(delete_activity_post_thunk(id));
        if (delete_activity_post_thunk.fulfilled.match(result)) {
            dispatch(
                setAlert({
                    type: "success",
                    title: "Post Deleted Successfully!",
                }),
            );
        }
    };

    return { handleDelete };
}
