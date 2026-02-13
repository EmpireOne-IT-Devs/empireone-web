import Button from '@/app/_components/button'
import React from 'react'
import { TbTrash } from 'react-icons/tb'

export default function DeleteRequisitionSection() {
  return (
    <div>
        <Button outlined variant="danger" className='w-full flex justify-start'>
           <TbTrash className="w-5 h-5 mr-2" /> Delete
        </Button>
    </div>
  )
}
