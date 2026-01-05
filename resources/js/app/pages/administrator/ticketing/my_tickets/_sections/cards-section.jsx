import Card from '@/app/_components/card'
import React from 'react'
import { TbChecks, TbClockCancel, TbListDetails, TbProgressCheck, TbTicket } from 'react-icons/tb'
import { TiWarning } from 'react-icons/ti'

export default function CardsSection() {
  return (
  <div className="flex gap-3 w-full">
             <Card className="w-full flex-col gap-3">
                 <div className="flex-row flex items-start justify-between">
                     <div className="bg-blue-600 p-3 rounded-xl w-16">
                         <TbTicket className="inline-block mr-2 text-4xl text-white" />
                     </div>
                     <div className=" text-3xl font-black">15%</div>
                 </div>
                 <div className="flex-col flex items-start justify-between">
                   
                     <div>Total Tickets</div>
                 </div>
             </Card>
             <Card className="w-full flex-col gap-3">
                 <div className="flex-row flex items-start justify-between">
                     <div className="bg-orange-600 p-3 rounded-xl w-16">
                         <TbClockCancel className="inline-block mr-2 text-4xl text-white" />
                     </div>
                     <div className=" text-3xl font-black">15%</div>
                 </div>
                 <div className="flex-col flex items-start justify-between">
                     <div>Pending</div>
                 </div>
             </Card>
             <Card className="w-full flex-col gap-3">
                 <div className="flex-row flex items-start justify-between">
                     <div className="bg-yellow-600 p-3 rounded-xl w-16">
                         <TbProgressCheck className="inline-block mr-2 text-4xl text-white" />
                     </div>
                     <div className=" text-3xl font-black">15%</div>
                 </div>
                 <div className="flex-col flex items-start justify-between">
                     <div>In Progress</div>
                 </div>
             </Card>
             <Card className="w-full flex-col gap-3">
                 <div className="flex-row flex items-start justify-between">
                     <div className="bg-green-600 p-3 rounded-xl w-16">
                         <TbChecks className="inline-block mr-2 text-4xl text-white" />
                     </div>
                     <div className=" text-3xl font-black">15%</div>
                 </div>
                 <div className="flex-col flex items-start justify-between">
                     <div>Resolved</div>
                 </div>
             </Card>
              <Card className="w-full flex-col gap-3">
                 <div className="flex-row flex items-start justify-between">
                     <div className="bg-red-600 p-3 rounded-xl w-16">
                         <TiWarning className="inline-block mr-2 text-4xl text-white" />
                     </div>
                     <div className=" text-3xl font-black">15%</div>
                 </div>
                 <div className="flex-col flex items-start justify-between">
                     <div>Critical</div>
                 </div>
             </Card>
         </div>
  )
}
