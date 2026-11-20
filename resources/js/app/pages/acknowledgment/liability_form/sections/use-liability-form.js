import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clear_liability_form_detail } from "@/app/redux/asset-liability-form-slice";
import { act_on_liability_form_thunk, get_liability_form_thunk } from "@/app/redux/asset-liability-form-thunk";

export default function useLiabilityForm(uuid) {
    const dispatch = useDispatch();
    const detail = useSelector((state) => state.asset_liability_forms.detail);
    const [revision, setRevision] = useState(0);
    const [busy, setBusy] = useState(null);
    const [actionError, setActionError] = useState(null);
    const inFlight = useRef(false);

    useEffect(() => {
        const request = dispatch(get_liability_form_thunk(uuid));
        return () => {
            request.abort();
            dispatch(clear_liability_form_detail(uuid));
        };
    }, [dispatch, uuid, revision]);

    const reload = useCallback(() => {
        setActionError(null);
        setRevision((value) => value + 1);
    }, []);

    const run = async (action, payload) => {
        if (inFlight.current) return false;
        inFlight.current = true;
        setBusy(action);
        setActionError(null);
        try {
            await dispatch(act_on_liability_form_thunk({ uuid, action, payload })).unwrap();
            return true;
        } catch (error) {
            setActionError(error);
            return false;
        } finally {
            inFlight.current = false;
            setBusy(null);
        }
    };

    return {
        form: detail.uuid === uuid ? detail.form : null,
        loading: detail.uuid !== uuid || detail.loading,
        error: detail.uuid === uuid ? detail.error : null,
        reload,
        run,
        busy,
        actionError,
    };
}
