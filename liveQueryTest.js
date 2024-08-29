const Parse = require('parse/node');

const appConfig = {
  appName: "Test App",
  appId: "vYDeDN17e7M4ijmiftaPmTLBRyKh9vhpaKYCmSf3",
  javascriptKey: "iIHvYViJ3BLr8I7Oqg0KECYpZk1MXBwEKy0r6p3H",
  masterKey: "XHQsnf32PRhUpJW3bHwyGpFc2LDs0YH0By60UiIH",
  clientKey: "ibK4sWDSKYGtmPqd9aGJcxU40WA2lb6E9jsRdgnw",
  senderID: "456141054233"
};

Parse.initialize(appConfig.appId, appConfig.javascriptKey);
Parse.serverURL = 'https://testapp-annie.b4a.io';

(async () => {
  const query = new Parse.Query('WatchList');
  query.equalTo('isWatched', false);
  
  let subscription = await query.subscribe();
  let watchList = {};
  
  subscription.on('open', async () => {
    console.log('subscription opened');
    const results = await query.find();
    watchList = results.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), watchList);
    console.log(JSON.stringify(watchList, null, 2));
  });
  
  subscription.on('create', (object) => {
    watchList[object.id] = object;
    console.log('object created');
    console.log(JSON.stringify(watchList, null, 2));
  });
  
  subscription.on('update', (object) => {
    console.log('object updated');
    watchList[object.id] = object;
    console.log(JSON.stringify(watchList, null, 2));
  });
  
  subscription.on('enter', (object) => {
    console.log('object entered');
    watchList[object.id] = object;
    console.log(JSON.stringify(watchList, null, 2));
  });
  
  subscription.on('leave', (object) => {
    console.log('object left');
    delete watchList[object.id];
    console.log(JSON.stringify(watchList, null, 2));
  });
  
  subscription.on('delete', (object) => {
    console.log('object deleted');
    delete watchList[object.id];
    console.log(JSON.stringify(watchList, null, 2));
  });
  
  subscription.on('close', () => {
    console.log('subscription closed');
  });
  
})();
