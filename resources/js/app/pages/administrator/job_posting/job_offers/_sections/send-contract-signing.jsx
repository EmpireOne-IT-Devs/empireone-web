import Button from '@/app/_components/button'
import Modal from '@/app/_components/modal'
import React, { useState } from 'react'

export default function SendContractSigning() {
  const [open,setOpen]=useState(false)
  return (
    <div>
        <Button
        onClick={()=>setOpen(true)}
        variant='success'>SEND CONTRACT</Button>
        <Modal
        
        
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Send Contact Signing"
        ></Modal>
    </div>
  )
}
