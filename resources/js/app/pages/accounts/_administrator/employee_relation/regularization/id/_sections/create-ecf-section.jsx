import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const CreateECFSection = () => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      employee_name: '',
      supervisor_name: '',
      self_assessment_date: '',
      objectives: [
        { title: '', action_items: '', outcomes: '', emp_rating: '', mgr_rating: '' }
      ],
      performance: {
        job_knowledge: { emp: '', mgr: '' },
        communication: { emp: '', mgr: '' },
        management: { emp: '', mgr: '' },
        organizing: { emp: '', mgr: '' },
        initiative: { emp: '', mgr: '' },
        discipline: { emp: '', mgr: '' },
        attendance: { emp: '', mgr: '' },
      },
      remarks: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "objectives"
  });

  // Watch form values for real-time calculations
  const watchedObjectives = watch("objectives");
  const watchedPerformance = watch("performance");

  // --- INTERACTIVE CALCULATION LOGIC ---
  const getSection1Score = () => {
    const ratings = watchedObjectives
      .map(obj => parseFloat(obj.mgr_rating))
      .filter(val => !isNaN(val) && val > 0);
    
    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
  };

  const getSection2Score = () => {
    const ratings = Object.values(watchedPerformance)
      .map(item => parseFloat(item.mgr))
      .filter(val => !isNaN(val) && val > 0);
      
    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
  };

  const section1Score = getSection1Score();
  const section2Score = getSection2Score();
  const totalScore = section1Score > 0 && section2Score > 0 
    ? ((parseFloat(section1Score) + parseFloat(section2Score)) / 2).toFixed(2) 
    : 0;

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600 bg-green-50';
    if (score >= 3.5) return 'text-blue-600 bg-blue-50';
    if (score >= 2.5) return 'text-yellow-600 bg-yellow-50';
    if (score > 0) return 'text-red-600 bg-red-50';
    return 'text-gray-800 bg-gray-100';
  };

  const onSubmit = (data) => {
    const finalPayload = {
      ...data,
      calculated_scores: {
        section_1: section1Score,
        section_2: section2Score,
        total_average: totalScore
      }
    };
    console.log("Submitting Form Data:", finalPayload);
  };

  // --- REUSABLE COMPONENTS ---
  const SectionHeader = ({ title }) => (
    <div className="bg-gray-800 text-white p-2 font-bold uppercase mt-8 mb-4 shadow-sm rounded-t-sm">
      {title}
    </div>
  );

  // Helper for rendering 1-5 radio buttons cleanly
  const RatingRadioGroup = ({ name, isManager }) => (
    <div className="flex justify-between w-full px-2">
      {[1, 2, 3, 4, 5].map((val) => (
        <label key={val} className="flex flex-col items-center cursor-pointer group">
          <span className={`text-[10px] font-bold mb-1 ${isManager ? 'text-blue-800' : 'text-gray-500'} group-hover:text-blue-500 transition-colors`}>
            {val}
          </span>
          <input 
            type="radio" 
            value={val} 
            {...register(name)} 
            className={`w-4 h-4 cursor-pointer ${isManager ? 'accent-blue-600' : 'accent-gray-600'}`} 
          />
        </label>
      ))}
    </div>
  );

  const inputStyles = "w-full p-2 border-b-2 border-transparent bg-yellow-50 hover:bg-yellow-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none rounded-sm";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl border border-gray-200 my-10 rounded-lg">
      <div className="flex justify-between items-center mb-8 border-b-4 border-blue-600 pb-4">
        <div className="text-3xl font-black text-blue-900 tracking-tighter">EMPIRE<span className="text-blue-500">ONE</span></div>
        <div className="text-right">
          <h1 className="font-bold text-xl uppercase tracking-wider text-gray-800">Performance Evaluation</h1>
          <p className="text-sm text-gray-500 font-medium">(Probationary Employee)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-[1px] bg-gray-300 border border-gray-300 rounded-sm overflow-hidden shadow-sm">
          <div className="p-3 font-semibold bg-gray-100 flex items-center">Employee Name:</div>
          <input {...register("employee_name")} className={`${inputStyles} bg-white m-[1px] w-[calc(100%-2px)]`} placeholder="John Doe" />
          
          <div className="p-3 font-semibold bg-gray-100 flex items-center">Supervisor Name:</div>
          <input {...register("supervisor_name")} className={`${inputStyles} bg-white m-[1px] w-[calc(100%-2px)]`} placeholder="Jane Smith" />
          
          <div className="p-3 font-semibold bg-gray-100 flex items-center">Date of Assessment:</div>
          <input type="date" {...register("self_assessment_date")} className={`${inputStyles} bg-white m-[1px] w-[calc(100%-2px)]`} />
        </div>

        {/* Legend */}
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm">
          <p className="font-bold text-blue-900 mb-1">Rating Scale:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-blue-800">
            <span><strong>5</strong> - Excellent</span>
            <span><strong>4</strong> - Outstanding</span>
            <span><strong>3</strong> - Satisfactory</span>
            <span><strong>2</strong> - Needs Improvement</span>
            <span><strong>1</strong> - Unacceptable</span>
          </div>
        </div>

        {/* SECTION 1 */}
        <SectionHeader title="Section 1: Objectives (50%)" />
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 p-4 rounded-md bg-gray-50 shadow-sm relative group hover:border-blue-300 transition-colors">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase text-gray-600 mb-1">Objective</label>
                  <textarea {...register(`objectives.${index}.title`)} className={inputStyles} rows="2" placeholder="Describe objective..." />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase text-gray-600 mb-1">Action Items</label>
                  <textarea {...register(`objectives.${index}.action_items`)} className={inputStyles} rows="2" placeholder="Steps taken..." />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase text-gray-600 mb-1">Outcomes</label>
                  <textarea {...register(`objectives.${index}.outcomes`)} className={inputStyles} rows="2" placeholder="Results..." />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 bg-white p-3 border border-gray-100 rounded">
                <div className="flex flex-col gap-1 justify-center border-r pr-6">
                  <label className="text-xs font-bold text-gray-700 text-center mb-1">Employee Rating</label>
                  <RatingRadioGroup name={`objectives.${index}.emp_rating`} isManager={false} />
                </div>
                <div className="flex flex-col gap-1 justify-center pl-2">
                  <label className="text-xs font-bold text-blue-900 text-center mb-1">Manager Rating</label>
                  <RatingRadioGroup name={`objectives.${index}.mgr_rating`} isManager={true} />
                </div>
              </div>

              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-md">
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => append({ title: '', action_items: '', outcomes: '', emp_rating: '', mgr_rating: '' })} className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:text-blue-800 transition-colors p-2 border border-dashed border-blue-300 rounded w-full justify-center hover:bg-blue-50">
            + Add Another Objective
          </button>
        </div>

        {/* SECTION 2 */}
        <SectionHeader title="Section 2: General Performance Requirements (50%)" />
        <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3 border-b w-1/2">Requirement</th>
                <th className="px-4 py-3 border-b border-l text-center w-1/4">Emp. Rating</th>
                <th className="px-4 py-3 border-b border-l text-center w-1/4 bg-blue-50">Mgr. Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { label: 'Job Knowledge', key: 'job_knowledge', desc: 'Application, Technical and Professional skills' },
                { label: 'Communication Skills', key: 'communication', desc: 'Communicates effectively to clients/individuals' },
                { label: 'Management Skills', key: 'management', desc: 'Leads team to get desired results' },
                { label: 'Organizing Skills', key: 'organizing', desc: 'Sets priorities for tasks and commitments' },
                { label: 'Initiative', key: 'initiative', desc: 'Commitment to seek improvements' },
                { label: 'Discipline', key: 'discipline', desc: 'Adherence to provisions in Code of Conduct' },
                { label: 'Attendance', key: 'attendance', desc: 'Adherence to provisions in Attendance policy' },
              ].map((item) => (
                <tr key={item.key} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-gray-800 block">{item.label}</span>
                    <span className="text-xs text-gray-500 italic">{item.desc}</span>
                  </td>
                  <td className="border-l p-2 align-middle">
                    <RatingRadioGroup name={`performance.${item.key}.emp`} isManager={false} />
                  </td>
                  <td className="border-l p-2 align-middle bg-blue-50/30">
                    <RatingRadioGroup name={`performance.${item.key}.mgr`} isManager={true} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* INTERACTIVE SCORING TABLE */}
        <SectionHeader title="Over-all Rating" />
        <div className="flex justify-end">
          <table className="w-1/2 border-collapse border border-gray-300 text-sm shadow-sm rounded-md overflow-hidden">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold bg-gray-100 w-2/3">Section 1 (50%) Average:</td>
                <td className="p-3 text-center font-mono font-bold">{section1Score > 0 ? section1Score : '-'}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold bg-gray-100">Section 2 (50%) Average:</td>
                <td className="p-3 text-center font-mono font-bold">{section2Score > 0 ? section2Score : '-'}</td>
              </tr>
              <tr>
                <td className="p-3 font-black bg-gray-800 text-white uppercase tracking-wider">Total Average Score:</td>
                <td className={`p-3 text-center font-mono font-black text-lg ${getScoreColor(totalScore)} transition-colors duration-500`}>
                  {totalScore > 0 ? totalScore : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remarks Section */}
        <div className="mt-8 bg-gray-50 p-4 rounded border border-gray-200">
          <label className="font-bold block mb-2 text-gray-800 uppercase tracking-wide">Remarks / Comments:</label>
          <textarea {...register("remarks")} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[120px]" placeholder="Add your evaluation remarks here..." />
        </div>

        {/* Signatures */}
        <div className="mt-12 grid grid-cols-2 gap-12 px-6">
          <div className="border-t-2 border-gray-800 pt-2 text-center group cursor-pointer hover:bg-gray-50 rounded transition-colors pb-4">
            <p className="text-sm font-bold uppercase text-gray-800">Employee Name & Signature</p>
          </div>
          <div className="border-t-2 border-gray-800 pt-2 text-center group cursor-pointer hover:bg-gray-50 rounded transition-colors pb-4">
            <p className="text-sm font-bold uppercase text-gray-800">Immediate Superior Name & Signature</p>
          </div>
        </div>

        <div className="flex justify-center mt-10 pt-6 border-t border-gray-200">
          <button type="submit" className="bg-blue-600 text-white px-12 py-4 font-black tracking-wider rounded shadow-xl hover:bg-blue-700 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:shadow-md transition-all duration-200">
            SUBMIT EVALUATION
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateECFSection;