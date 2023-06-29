const RudderAnalytics = require("@rudderstack/rudder-sdk-node");

const Analytics = new RudderAnalytics('2RrdjdIIqqgWmUpPtboBM9iEN6L', {
    dataPlaneUrl: 'https://weareloupyauxv.dataplane.rudderstack.com',
    logLevel: 'debug',
    gzip: false,
    flushInterval: 0,
    flushAt: 1,
    errorHandler: (e: any) => {
        console.log(e.toJSON(),'err');
        return e;
    }
})

export default async function handler(req, res) {
    await Analytics.track({
        userId: "1hKOmRA4GRlm",
        event: "click",
        properties: {
            name: "Alex Keener",
            email: "alex@example.com"
        },
        context: {
            ip: 'ip'
        },
        // timestamp:
    });

    // console.log(req,'req')
    // console.log(res,'res')
    console.log(Analytics, 'analytics')


    res.status(200).json({ name: 'Success' })
}
