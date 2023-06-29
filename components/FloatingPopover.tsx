import { Popover, Transition } from "@headlessui/react";
import { useState } from "react";
import { usePopper } from "react-popper";
import { useAnalyticsStore } from "../stores";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/dist/monikai";
import { Fragment } from "react";

export const FloatingPopover = ({ data, analyticsEvent, analyticsPayload }) => {
  const events = useAnalyticsStore((state) => state.events);

  return (
    <div className="fixed top-2 w-full max-w-sm px-4" style={{ zIndex: 2000 }}>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex items-center rounded-md bg-orange-700 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span>Analytics</span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="relative z-10 mt-3 w-screen max-w-xl px-4">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative flex flex-col gap-2 bg-white p-7 lg:grid-cols-2">
                    {events &&
                      events.length > 0 &&
                      events.map((event, idx) => (
                        <Disclosure key={idx}>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <div className={"flex items-center gap-2"}>
                                  <span>{event.event}</span>
                                  <div className={`flex items-center justify-center rounded-full bg-${event.tag.color}-500 px-2 text-xs text-white`}>
                                    {event.tag.label}
                                  </div>
                                </div>
                                <ChevronUpIcon
                                  className={`${
                                    open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-purple-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="px-1 text-sm text-gray-500">
                                <table className="w-full border-collapse items-center bg-amber-200 bg-transparent">
                                  <thead className={'bg-amber-100'}>
                                    <tr>
                                      <th className="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid py-3 text-left align-middle text-xs font-bold">
                                        Property
                                      </th>
                                      <th className="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid py-3 text-left align-middle text-xs font-bold">
                                        Value
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {Object.entries(event.properties).map(
                                      ([key, value], idx) => (
                                        <tr key={idx}>
                                          <th className="text-blueGray-700 w-2/6 border-l-0 border-r-0 border-t-0 py-3 text-left align-top text-xs">
                                            {key}
                                          </th>
                                          <td className="max-w-3xl whitespace-normal break-words border-l-0 border-r-0 border-t-0 align-middle text-xs ">
                                              {typeof value === 'object' ?  <JSONPretty
                                                  data={JSON.stringify(value)}
                                              ></JSONPretty> : value}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
    // <Popover className="absolute z-50 bottom-5 right-2">
    //     <Popover.Button className={'bg-gradient-to-r from-blue-600 to-blue-400 p-2 rounded-xl fixed text-md font-extrabold bottom-2 right-2 text-gray-50'}>Analytics</Popover.Button>
    //
    //     <Popover.Panel
    //         className={'rounded-2xl w-96 h-96'}
    //     >
    //         <div className="w-full h-full p-4 overflow-auto bg-amber-50 flex flex-col gap-2">

    //         </div>
    //     </Popover.Panel>
    // </Popover>
  );
};
