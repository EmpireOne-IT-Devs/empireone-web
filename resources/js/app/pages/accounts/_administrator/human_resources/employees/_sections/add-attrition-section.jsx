import React, { useEffect, useState, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FcLeave } from 'react-icons/fc';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import moment from 'moment';

import Button from '@/app/_components/button';
import Modal from '@/app/_components/modal';
import Radio from '@/app/_components/radio';

import { setAlert } from '@/app/redux/app-slice';
import { add_attrition_service } from '@/app/services/employee-relation-service';
import store from '@/app/store/store';
import { get_employees_thunk } from '@/app/redux/employee-relation-thunk';

const TERMINATION_REASONS = [
    "Resignation - Personal",
    "Resignation - Better Opportunity",
    "Resignation - Career Change",
    "Resignation - Medical",
    "Resignation - Education",
    "Resignation - Relocation",
    "Resignation - Compensation",
    "Resignation - Management",
    "Resignation - Culture",
    "Resignation - Schedule",
    "Resignation - Job Misfit",
    "Termination - Attendance",
    "Termination - Behavior",
    "Termination - Performance",
    "Termination - Company Policy Violation",
    "Termination - Training Fall-Out (Language Training)",
    "Termination - Training Fall-Out (Process Training)",
    "Termination - Training Fall-Out (On-The-Job Training)",
    "Termination - Absconding/ AWOL Redundancy",
    "Termination - Non-Regularization",
    "End of Contract (Fixed Term)"
];

export default function AddAttritionSection({ props_data, onAction }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { leaders } = useSelector((store) => store.human_resources);
    const { data } = useSelector((store) => store.app);

    const { register, handleSubmit, reset, control, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            separation_date: '',
            reason_for_separation: '',
            is_rehire: '',
            supervisor_id: '',
            department_manager_id: '',
            clearance_departments: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "clearance_departments"
    });

    const watchedClearanceDepts = watch("clearance_departments");

    // Leader options for upper modal form controls
    const leaderOptions = useMemo(() => {
        return leaders?.map((res) => ({
            label: `${res?.employee?.personal_information?.first_name || ''} ${res?.employee?.personal_information?.last_name || ''}`.trim() || res?.user?.name,
            value: res.id,
        })) || [];
    }, [leaders]);

    // Filter out departments that are already added to the clearance table
    const availableDepartmentOptions = useMemo(() => {
        const selectedDeptIds = (watchedClearanceDepts || []).map((dept) => String(dept.department_id)).filter(Boolean);
        return (data?.departments || []).filter((dept) => !selectedDeptIds.includes(String(dept.id)));
    }, [data?.departments, watchedClearanceDepts]);

    const handleOpenModal = () => {
        setOpen(true);
        if (onAction) onAction();
    };

    const handleCloseModal = () => {
        setOpen(false);
        reset({
            separation_date: '',
            reason_for_separation: '',
            is_rehire: '',
            supervisor_id: '',
            department_manager_id: '',
            clearance_departments: []
        });
    };

    useEffect(() => {
        if (open && props_data) {
            setValue('supervisor_id', props_data?.e_r_leader_id || '');
            setValue('department_manager_id', props_data?.department_manager_id || '');
        }
    }, [open, props_data, setValue]);

    const handleAddDepartment = () => {
        append({ department_id: '', assigned_leader_id: '', payable: '0.00' });
    };

    const onSubmit = async (formData) => {
        try {
            await add_attrition_service({
                ...props_data,
                ...formData
            });
            await store.dispatch(get_employees_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Attrition Created Successfully!",
                    message: "The exit clearance form has been generated and filed.",
                    open: true,
                })
            );
            handleCloseModal();
        } catch (error) {
            console.error("Failed to add attrition:", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Error",
                    message: error?.response?.data?.message || "Failed to submit attrition. Please try again.",
                    open: true,
                })
            );
        }
    };

    const employeeName = props_data?.user?.name || `${props_data?.personal_information?.first_name || ''} ${props_data?.personal_information?.last_name || ''}`.trim() || 'N/A';
    const accountDept = `${props_data?.account?.name || props_data?.account || ''} / ${props_data?.department?.name || ''}`.replace(/^ \/ | \/ $/g, '') || 'N/A';

    return (
        <>
            <button
                type="button"
                onClick={handleOpenModal}
                className="group flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
                <FcLeave
                    size={20}
                    className="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"
                />
                ADD TO ATTRITION
            </button>

            <Modal
                isOpen={open}
                onClose={handleCloseModal}
                width="max-w-5xl"
                title=""
            >
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white font-sans text-gray-900 text-xs">
                    {/* Header Logo & Document Date */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-2xl font-black tracking-tight">
                            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-l-md italic">E1</span>
                            <span className="text-purple-900 ml-2">Empire<span className="text-purple-600">One</span>CX</span>
                        </div>
                        <div className="text-right">
                            <span className="font-bold uppercase tracking-wider text-gray-700">DATE: </span>
                            <span className="font-semibold text-gray-900">{moment().format('MMMM D, YYYY')}</span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h1 className="text-sm font-bold tracking-wide text-gray-800 uppercase">EXIT CLEARANCE</h1>
                    </div>

                    {/* Table Grid Structure */}
                    <div className="border border-gray-900 mb-4 overflow-hidden">
                        <table className="w-full border-collapse text-xs">
                            <tbody>
                                {/* Row 1 */}
                                <tr className="border-b border-gray-900">
                                    <td className="w-1/2 p-2.5 border-r border-gray-900 align-top">
                                        <span className="font-bold text-gray-800 block">Name:</span>
                                        <span className="text-gray-900 font-medium">{employeeName}</span>
                                    </td>
                                    <td className="w-1/2 p-2.5 align-top">
                                        <span className="font-bold text-gray-800 block">ID Number:</span>
                                        <span className="text-gray-900 font-medium">{props_data?.employee_id || 'N/A'}</span>
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="border-b border-gray-900">
                                    <td className="w-1/2 p-2.5 border-r border-gray-900 align-top">
                                        <span className="font-bold text-gray-800 block">Account / Department:</span>
                                        <span className="text-gray-900 font-medium">{accountDept}</span>
                                    </td>
                                    <td className="w-1/2 p-2.5 align-top">
                                        <span className="font-bold text-gray-800 block">Position Title:</span>
                                        <span className="text-gray-900 font-medium">{props_data?.position || 'N/A'}</span>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="border-b border-gray-900">
                                    <td className="w-1/2 p-2.5 border-r border-gray-900 align-top">
                                        <span className="font-bold text-gray-800 block">Date Hired:</span>
                                        <span className="text-gray-900 font-medium">{props_data?.started_at || 'N/A'}</span>
                                    </td>
                                    <td className="w-1/2 p-2.5 align-top">
                                        <span className="font-bold text-gray-800 block mb-0.5">Date Separated:</span>
                                        <input
                                            type="date"
                                            disabled={isSubmitting}
                                            {...register("separation_date", { required: true })}
                                            className="w-full bg-transparent border-0 outline-none p-0 focus:ring-0 text-xs text-gray-900 cursor-pointer font-medium"
                                        />
                                    </td>
                                </tr>

                                {/* Row 4 */}
                                <tr className="border-b border-gray-900">
                                    <td className="w-1/2 p-2.5 border-r border-gray-900 align-top">
                                        <span className="font-bold text-gray-800 block mb-0.5">Immediate Supervisor:</span>
                                        <Controller
                                            name="supervisor_id"
                                            control={control}
                                            rules={{ required: "Supervisor required" }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    disabled={isSubmitting}
                                                    className="w-full bg-transparent border-0 outline-none p-0 focus:ring-0 text-xs text-gray-900 cursor-pointer font-medium"
                                                >
                                                    <option value="">Select Supervisor...</option>
                                                    {leaderOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                    </td>
                                    <td className="w-1/2 p-2.5 align-top">
                                        <span className="font-bold text-gray-800 block mb-0.5">Department Manager:</span>
                                        <Controller
                                            name="department_manager_id"
                                            control={control}
                                            rules={{ required: "Manager required" }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    disabled={isSubmitting}
                                                    className="w-full bg-transparent border-0 outline-none p-0 focus:ring-0 text-xs text-gray-900 cursor-pointer font-medium"
                                                >
                                                    <option value="">Select Department Manager...</option>
                                                    {leaderOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                    </td>
                                </tr>

                                {/* Row 5 */}
                                <tr>
                                    <td className="w-1/2 p-2.5 border-r border-gray-900 align-top">
                                        <span className="font-bold text-gray-800 block">Employment Status:</span>
                                        <span className="text-gray-900 font-medium">{props_data?.status || 'Regular'}</span>
                                    </td>
                                    <td className="w-1/2 p-2.5 align-top">
                                        <span className="font-bold text-gray-800 block mb-0.5">Reason for Separation:</span>
                                        <Controller
                                            name="reason_for_separation"
                                            control={control}
                                            rules={{ required: "Reason required" }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    disabled={isSubmitting}
                                                    className="w-full bg-transparent border-0 outline-none p-0 focus:ring-0 text-xs text-gray-900 cursor-pointer font-medium"
                                                >
                                                    <option value="">Select Reason...</option>
                                                    {TERMINATION_REASONS.map((reason) => (
                                                        <option key={reason} value={reason}>{reason}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Rehire Eligibility Selection */}
                    <div className="my-3 p-2.5 border border-gray-200 rounded bg-gray-50 flex items-center justify-between">
                        <span className="font-bold text-gray-800">Eligible for Rehire:</span>
                        <Controller
                            name="is_rehire"
                            control={control}
                            rules={{ required: "Please confirm rehire eligibility" }}
                            render={({ field }) => (
                                <div className="flex gap-6">
                                    <Radio
                                        label="Yes"
                                        value="Yes"
                                        checked={field.value === "Yes"}
                                        onChange={() => field.onChange("Yes")}
                                        disabled={isSubmitting}
                                    />
                                    <Radio
                                        label="No"
                                        value="No"
                                        checked={field.value === "No"}
                                        onChange={() => field.onChange("No")}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    {errors.is_rehire && (
                        <span className="text-xs text-red-500 block mb-2">{errors.is_rehire.message}</span>
                    )}

                    {/* Certification Text & Add Department Button */}
                    <div className="flex items-center justify-between my-3">
                        <p className="text-xs text-gray-700">
                            We are here to certify that the above employee is cleared with any accountability or financial obligation to the following:
                        </p>
                        <button
                            type="button"
                            onClick={handleAddDepartment}
                            disabled={availableDepartmentOptions.length === 0}
                            className={`flex items-center gap-1.5 px-3 py-1 font-bold rounded border transition-colors shrink-0 ml-2 ${availableDepartmentOptions.length === 0
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 cursor-pointer'
                                }`}
                        >
                            <FiPlus size={14} />
                            <span>Add Department</span>
                        </button>
                    </div>

                    {/* Clearance Signatures Table */}
                    <div className="border border-gray-900 overflow-x-auto mb-4">
                        <table className="w-full text-xs text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-900 bg-gray-50 text-center font-bold text-gray-800">
                                    <th className="p-2 border-r border-gray-900 w-1/2">Department</th>
                                    <th className="p-2 border-r border-gray-900 w-1/2">Assigned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900">
                                {fields.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="p-4 text-center text-gray-400 italic">
                                            No clearance departments added yet. Click "+ Add Department" above to add one.
                                        </td>
                                    </tr>
                                ) : (
                                    fields.map((row, index) => {
                                        const currentDeptId = watchedClearanceDepts?.[index]?.department_id;
                                        const selectedDept = (data?.departments || []).find((d) => String(d.id) === String(currentDeptId));

                                        // Parse available leaders specifically belonging to the selected department
                                        const departmentLeadersOptions = selectedDept?.department_leaders?.map((leader) => {
                                            const personalInfo = leader?.employee?.personal_information;
                                            const fullName = personalInfo
                                                ? `${personalInfo.first_name || ''} ${personalInfo.last_name || ''}`.trim()
                                                : leader?.employee?.user?.name || `Leader #${leader.id}`;

                                            return {
                                                id: leader.id,
                                                name: fullName
                                            };
                                        }) || [];

                                        return (
                                            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                                {/* Department Select Cell */}
                                                <td className="p-2 border-r border-gray-900 text-gray-800">
                                                    <div className="flex items-center gap-1">
                                                        <Controller
                                                            name={`clearance_departments.${index}.department_id`}
                                                            control={control}
                                                            rules={{ required: "Select a department" }}
                                                            render={({ field }) => (
                                                                <select
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        field.onChange(e);
                                                                        // Reset assigned leader when department changes
                                                                        setValue(`clearance_departments.${index}.assigned_leader_id`, '');
                                                                    }}
                                                                    className="w-full py-0.5 px-1 bg-transparent border border-gray-300 rounded focus:border-purple-600 focus:outline-none text-xs font-semibold cursor-pointer"
                                                                >
                                                                    <option value="">Select Department...</option>
                                                                    {/* Retain current selection option if selected */}
                                                                    {selectedDept && (
                                                                        <option value={selectedDept.id}>{selectedDept.name}</option>
                                                                    )}
                                                                    {/* List remaining unselected departments */}
                                                                    {availableDepartmentOptions.map((dept) => (
                                                                        <option key={dept.id} value={dept.id}>
                                                                            {dept.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded shrink-0"
                                                            title="Remove Department"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Assigned Department Leader Cell */}
                                                <td className="p-2 text-gray-800">
                                                    <Controller
                                                        name={`clearance_departments.${index}.assigned_leader_id`}
                                                        control={control}
                                                        rules={{ required: "Select an assigned leader" }}
                                                        render={({ field }) => (
                                                            <select
                                                                {...field}
                                                                disabled={!currentDeptId}
                                                                className="w-full py-0.5 px-1 bg-transparent border border-gray-300 rounded focus:border-purple-600 focus:outline-none text-xs font-semibold cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                            >
                                                                <option value="">
                                                                    {currentDeptId
                                                                        ? departmentLeadersOptions.length > 0
                                                                            ? "Select Leader..."
                                                                            : "No leaders found for this department"
                                                                        : "Select a department first..."}
                                                                </option>
                                                                {departmentLeadersOptions.map((leader) => (
                                                                    <option key={leader.id} value={leader.id}>
                                                                        {leader.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold tracking-wide rounded"
                        loading={isSubmitting}
                    >
                        CONFIRM & SUBMIT ATTRITION
                    </Button>
                </form>
            </Modal>
        </>
    );
}