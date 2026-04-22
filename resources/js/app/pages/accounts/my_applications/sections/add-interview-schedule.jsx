import Modal from '@/app/_components/modal';
import React from 'react'


export default function AddInterviewSchedule({ open, onClose }) {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Add Interview Schedule"
            width="max-w-lg"
        ></Modal>
    );
}