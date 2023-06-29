const RudderAnalytics = require("@rudderstack/rudder-sdk-node");

const Analytics = new RudderAnalytics('2RrdjdIIqqgWmUpPtboBM9iEN6L', {
    dataPlaneUrl: 'https://weareloupyauxv.dataplane.rudderstack.com',
    logLevel: 'debug',
    gzip: true,
    flushInterval: 0,
    flushAt: 1,
    errorHandler: (e: any) => {
        console.log(e.toJSON(),'err');
        return e;
    }
})

export default async function handler(req, res) {
    console.log(req.body,'req.body');


   if(req.body){
       const data = JSON.parse(req.body)
       await Analytics.track({
           userId: "1hKOmRA4GRlm",
           event: data.event,
           properties: data.properties,
           context: {
               ip: 'ip'
           },
           // timestamp:
       });
   }

    // console.log(req,'req')
    // console.log(res,'res')
    // console.log(Analytics, 'analytics')

    Analytics.flush(function(err, batch){
            console.log('Flushing done');
        }
    )


    res.status(200).json({ name: 'Success' })
}
