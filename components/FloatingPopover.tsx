import { Popover, Transition } from '@headlessui/react'
import {useState} from 'react'
import {usePopper} from 'react-popper'

export const FloatingPopover = ({ data, analyticsEvent, analyticsPayload }) => {
    let [referenceElement, setReferenceElement] = useState()
    let [popperElement, setPopperElement] = useState()
    let { styles, attributes } = usePopper(referenceElement, popperElement)

    return (
        <Popover>
            <Popover.Button className={'bg-gradient-to-r from-blue-600 to-blue-400 p-2 rounded-xl fixed text-md font-extrabold bottom-2 right-2 text-gray-50'} ref={setReferenceElement}>Analytics</Popover.Button>

            <Popover.Panel
                ref={setPopperElement}
                style={{
                    ...styles.popper,
                    height: 400,
                    width: 400,
                }}
                className={'rounded-2xl'}
                {...attributes.popper}
            >
                <div
                    style={{
                    backgroundImage: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'
                }}
                    className={'p-6 text-gray rounded-2xl -50 w-full h-full'}
                >
                    <h2 className={'text-lg font-extrabold text-gray-50 pb-2'}>Tracking Data</h2>
                    <div className={'w-full h-full'}>
                        <p className={'mt-3 text-gray-50'}>
                            <h3 className={'text-sm font-bold text-gray-300 uppercase'}>Analytics Event</h3><span className={'font-mono'}>{analyticsEvent}</span></p>
                        <p className={'mt-3 text-gray-50'}>
                        <h3 className={'text-sm font-bold text-gray-300 uppercase'}>Current Payload</h3>
                            <span className={'font-mono'}>{JSON.stringify(analyticsPayload)}</span>
                        </p>
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    )
}