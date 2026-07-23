import React, { useEffect } from "react";
import EmploymentContractSection from "./_sections/employment-contract-section";
import store from "@/app/store/store";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";
import { useSelector } from "react-redux";
import VerifySection from "../_sections/verify-section";
import Button from "@/app/_components/button";
import AgreeSection from "./_sections/agree-section";
import moment from "moment";

export default function Page() {
    const { user, hr } = useSelector((store) => store.app);
    const user_id = window.location.pathname.split("/")[3];
    useEffect(() => {
        store.dispatch(get_user_by_id_thunk(user_id));
    }, []);

    const employer_name = `${hr?.personal_information?.first_name ?? ''} ${hr?.personal_information?.last_name ?? ''}`
    const employer_position = `${hr?.position}`
    const employer_signature = `${hr?.signature}`

    const data = {
        user_id: user.id,
        signature: user?.account_employee?.signature ?? null,
        employee_name:
            `${user?.personal_information?.first_name} ${user?.personal_information?.middle_name == null ? '' : user?.personal_information?.middle_name} ${user?.personal_information?.last_name}`,
        employer_name: employer_name,
        employer_position: employer_position,
        employer_signature:employer_signature,
        reported_to:
            user?.account_contract?.reported_to ??
            `${user?.is_passed?.job_posting?.job_requisition?.user
                ?.personal_information?.first_name
            } ${user?.is_passed?.job_posting?.job_requisition?.user
                ?.personal_information?.middle_name
            } ${user?.is_passed?.job_posting?.job_requisition?.user
                ?.personal_information?.last_name
            }`,
        contract_signed_at:
            // user?.account_contract?.contract_signed_at ??
           moment().add(1, 'days').format('LLL'),
        residence:
            // user?.account_contract?.residence ??
            `${user?.personal_information?.barangay}  ${user?.personal_information?.city}`,
        province:
            // user?.account_contract?.province ??
            `${user?.personal_information?.province}`,
        full_address:
            // user?.account_contract?.full_address ??
            `${user?.personal_information?.street} ${user?.personal_information?.barangay}  ${user?.personal_information?.city}  ${user?.personal_information?.province}  ${user?.personal_information?.zip_code}`,
        position:
            // user?.account_contract?.position ??
            `${user?.account_employee?.position}`,
        started_at:
            // user?.account_contract?.started_at ??
            `${moment(user?.account_employee?.started_at).format("LL")}`,
        ended_at:
            // user?.account_contract?.ended_at ??
            `${moment(user?.account_employee?.started_at)
                .add(179, "days")
                .format("LL")}`,
        salary:
            // user?.account_contract?.salary ??
            `${user?.salary?.salary}`,
    };
    console.log('dadwada', user);
    function verified_section() {
        if (user?.account_employee?.signature === undefined) {
        } else if (user?.account_employee?.signature === null) {
            return (
                user?.account_employee?.signature === null && <VerifySection />
            );
        } else if (user?.account_employee?.signature != null) {
            return (
                <>
                    <EmploymentContractSection data={data} />
                    {!user?.account_employee?.is_has_contract && <AgreeSection data={data} user={user} />}
                </>
            );
        }
    }
    return <>{verified_section()}</>;
}
