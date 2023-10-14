"use client"
import { useState , Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const Modal = () => {
  
  let [isOpen, setIsOpen] = useState(true)
  return (
    <>
        <button
            type='button'
            className='btn'
            onClick={() => setIsOpen(true)}
        >
            Track
        </button>
        <Transition 
            appear
            show={isOpen}
            as={Fragment}
        >
            <Dialog 
                as="div" 
                onClose={() => setIsOpen(false)}
                className="dialog-container"    
            >
                <Dialog.Panel>
                    <Dialog.Title>Deactivate account</Dialog.Title>
                    <Dialog.Description>
                    This will permanently deactivate your account
                    </Dialog.Description>

                    <p>
                    Are you sure you want to deactivate your account? All of your data
                    will be permanently removed. This action cannot be undone.
                    </p>

                    <button onClick={() => setIsOpen(false)}>Deactivate</button>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                </Dialog.Panel>
            </Dialog>
        </Transition>
    </>
  )
}

export default Modal