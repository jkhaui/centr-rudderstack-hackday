import { useAnalyticsStore } from "../stores";

let rudder;

async function getInstance() {
  if (!rudder) {
    rudder = await import("rudder-sdk-js");
    rudder.load(
      "2Rrdqyi01JAKYRcMwgz5DeqiBeM",
      // TODO: replace with data plane URL hosted on Azure
      "https://weareloupyauxv.dataplane.rudderstack.com",
      { integrations: { All: true } }
    );
    await new Promise((resolve) => rudder.ready(resolve));
  }

  return rudder;
}

const reformatArgs = (args) => {
  const [eventName, eventData] = args || [];

  return {
    event: eventName,
    properties: eventData,
  };
};

const trackOnServer = async (data) => {
  fetch('/api/v1/rs', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

const rudderObj = {
  init: getInstance,
  identify: (...args) =>
    getInstance().then((r) => {
      const formattedArgs = reformatArgs(args);

      r.identify(...args);

      trackOnServer(formattedArgs);
      useAnalyticsStore.getState().addEvent({
        ...formattedArgs,
        tag: {
          label: "Identify",
          color: "red",
        },
      });
    }),
  track: (...args) =>
    getInstance().then((r) => {
      const formattedArgs = reformatArgs(args);

      r.track(...args);

      trackOnServer(formattedArgs);
      useAnalyticsStore.getState().addEvent({
        ...reformatArgs(args),
        tag: { label: "Track", color: "lime" },
      });
    }),
  getAnonymousId: async () => getInstance().then((r) => r.getAnonymousId()),
};

export default rudderObj;
