import Button from '@/app/_components/button'
import Modal from '@/app/_components/modal'
import { FileSignature, InfoIcon, SendIcon } from 'lucide-react'
import React, { useState } from 'react'
import { FaSpinner } from 'react-icons/fa6'

export default function SendContractSigning() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button variant="success" onClick={() => setOpen(true)} outlined>
        <span className="text-green-500">
          <SendIcon className="w-4 h-4 mr-2" />
        </span>
        Send Contract
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600 shrink-0">
              <FileSignature />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                Confirm Action
              </p>
              <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                Send Contract Signing
              </h2>
            </div>
          </div>
        }
        width="max-w-[400px]"
      >
        <div className="space-y-4 mt-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Are you sure you want to send the contract signing request to this
            candidate?
          </p>

          <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-green-50 border border-green-100">
            <span className="text-green-500 shrink-0 mt-px">
              <InfoIcon size={16} />
            </span>
            <p className="text-xs text-green-700 leading-relaxed">
              The candidate will receive an email immediately with a link to
              review and sign the contract.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="success" className="w-full">
              <div className="mr-2">
                <SendIcon className="w-3.5 h-3.5" />
              </div>
              Yes, Send Contract
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}