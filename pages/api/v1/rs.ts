const RudderAnalytics = require("@rudderstack/rudder-sdk-node");

const Analytics = new RudderAnalytics('22RrHVNKf75qNriW5KJ6Aa2HNcmz', {
    // TODO: replace with data plane URL hosted on Azure
    // dataPlaneUrl: 'https://api.rudderstack.com',
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
