import { useSelector } from "react-redux";

export const CONTENT_MANAGER_DEPARTMENT_IDS = [1, 11];


export default function useCurrentEmployee() {
    const data = useSelector((store) => store.app.data);

    const user = data?.user;
    const employee = user?.account_employee;
    const departmentId =
        employee?.department_id != null
            ? Number(employee.department_id)
            : null;

    return {
        user,
        employee,
        departmentId,
        isReady: Boolean(user),
        isContentManager: CONTENT_MANAGER_DEPARTMENT_IDS.includes(departmentId),
    };
}
