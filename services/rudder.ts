let rudder;
async function getInstance() {
    if (!rudder) {
        rudder = await import("rudder-sdk-js");
        rudder.load(
            '2RrHomaU5yLbCHppeY3iPx3ADLV',
            // TODO: replace with data plane URL hosted on Azure
            'https://api.rudderstack.com',
            { integrations: { All: true } }
        );
        await new Promise((resolve) => rudder.ready(resolve));
    }

    return rudder;
}

const rudderObj = {
    init: getInstance,
    track: (...args) => getInstance().then((r) => r.track(...args)),
    getAnonymousId: async () => getInstance().then((r) => r.getAnonymousId()),
};

export default rudderObj;
