import React, { useEffect } from "react";
import PartTimeProbationaryContractSection from "./_sections/part-time-probationary-contract-section";
import store from "@/app/store/store";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";
import { useSelector } from "react-redux";
import VerifySection from "../_sections/verify-section";
import Button from "@/app/_components/button";
import AgreeSection from "./_sections/agree-section";
import moment from "moment";
import FullTimeProbationaryContractSection from "./_sections/full-time-probationary-contract-section";
import SendContractSection from "./_sections/send-contract-section";

export default function Page() {
    const { user, hr } = useSelector((store) => store.app);
    const user_id = window.location.pathname.split("/")[3];

    // Extract search query parameter: contract_type
    const queryParams = new URLSearchParams(window.location.search);
    const contract_type = queryParams.get("contract_type");

    useEffect(() => {
        store.dispatch(get_user_by_id_thunk(user_id));
    }, []);

    const employer_name = `${hr?.personal_information?.first_name ?? ''} ${hr?.personal_information?.last_name ?? ''}`;
    const employer_position = `${hr?.position}`;
    const employer_signature = `${hr?.signature}`;

    const data = {
        user_id: user.id,
        signature: user?.account_employee?.signature ?? null,
        employee_name: `${user?.personal_information?.first_name} ${user?.personal_information?.middle_name == null ? '' : user?.personal_information?.middle_name} ${user?.personal_information?.last_name}`,
        first_name: `${user?.personal_information?.first_name}`,
        employer_name: employer_name,
        employer_position: employer_position,
        employer_signature: employer_signature,
        allowances: user?.job_offer?.allowances,
        reported_to: `${user?.account_employee?.er_leader?.employee?.personal_information?.first_name} ${user?.account_employee?.er_leader?.employee?.personal_information?.last_name}`,
        contract_signed_at: moment().add(1, 'days').format('LLL'),
        residence: `${user?.personal_information?.barangay}  ${user?.personal_information?.city}`,
        province: `${user?.personal_information?.province}`,
        full_address: `${user?.personal_information?.street} ${user?.personal_information?.barangay}  ${user?.personal_information?.city}  ${user?.personal_information?.province}  ${user?.personal_information?.zip_code}`,
        position: `${user?.account_employee?.position}`,
        started_at: `${moment(user?.account_employee?.started_at).format("LL")}`,
        ended_at: `${moment(user?.account_employee?.started_at).add(179, "days").format("LL")}`,
        salary: `${user?.job_offer?.salary}`,
    };
    console.log('useruser', user)
    function verified_section() {
        if (user?.account_employee?.signature === undefined) {
            return null;
        } else if (user?.account_employee?.signature === null) {
            return <VerifySection />;
        } else {
            return (
                <>
                    {(user?.application?.contract_type ?? 'probation_full_time') === 'probation_part_time' && (
                        <PartTimeProbationaryContractSection data={data} />
                    )}
                    {(user?.application?.contract_type ?? 'probation_full_time') === 'probation_full_time' && (
                        <FullTimeProbationaryContractSection data={data} />
                    )}
                    {!user?.account_employee?.is_has_contract && (
                        <AgreeSection data={data} user={user} />
                    )}
                    {user?.application?.final_status == "Sent Documents" && <SendContractSection props_data={user}/>}

                </>
            );
        }
    }

    return <>{verified_section()}</>;
}