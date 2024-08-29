const appConfig = {
  appName: "Test App",
  appId: "vYDeDN17e7M4ijmiftaPmTLBRyKh9vhpaKYCmSf3",
  javascriptKey: "iIHvYViJ3BLr8I7Oqg0KECYpZk1MXBwEKy0r6p3H",
  masterKey: "XHQsnf32PRhUpJW3bHwyGpFc2LDs0YH0By60UiIH",
  clientKey: "ibK4sWDSKYGtmPqd9aGJcxU40WA2lb6E9jsRdgnw",
  senderID: "456141054233"
};

Parse.initialize(appConfig.appId, appConfig.javascriptKey);
Parse.serverURL = 'https://parseapi.back4app.com';

document.querySelector("#appInfo").innerHTML = `Parse App - ${appConfig.appName} - ${appConfig.appId}`;
document.querySelector("#jsKey").innerHTML = `jsKey - ${appConfig.javascriptKey}`;

const retrieveClasses = async () => {
  try {
    const userQuery = new Parse.Query('_User');
    const eventQuery = new Parse.Query('Event');
    const userResults = await userQuery.find();
    const eventResults = await eventQuery.find();
    const users = userResults.map(user => ({ username: user.get('username'), password: 'hidden', email: user.get('email'), profilePic: user.get('profilePic') }));
    const eventsData = eventResults.map(event => ({ name: event.get('name'), desc: event.get('desc'), date: event.get('date'), location: event.get('location'), creator: event.get('creator') }));
    console.table(users);
    console.table(eventsData);
  } catch (err) {
    console.log(err)
    console.log('error in fetching users & events');
  }
};

const createUser = async () => {
  try {
    const User = Parse.Object.extend('_User');
    const user = new User();
    await user.save({
      email: 'new@user.com',
      username: 'new',
      password: 'password'
    });
  } catch (err) {
    console.log('error in creating new user');
  }
}

const logOutUser = async () => {
  if (getLoggedInUser()) {
    try {
      await Parse.User.logOut();
    } catch (err) {
      console.log('error in logging out...')
    }
  }
}

const signupUser = async () => {
  const user = new Parse.User();
  try {
    const resp = await user.signUp({
      email: 'tanjiro@b3a.com',
      username: 'tanjiro',
      password: 'password'
    });
    console.log(resp.get('sessionToken'));
  } catch (err) {
    console.log('error in signing up...', err);
  }
}

const loginUser = async () => {
  const user = await Parse.User.logIn("zenithsu", "password");
}

const createEventWithUser = async () => {
  console.log('coming here...');
  const curUser = getLoggedInUser();
  if (!curUser) {
    console.log('no user logged in')
  }

  const Event = Parse.Object.extend('Event');
  const event = new Event();
  event.set('name', 'Blessed Rain after drought')
  event.set('desc', '5th form of water breathing');
  event.set('date', new Date);
  event.set('creator', curUser);
  const point = new Parse.GeoPoint({latitude: 62.0, longitude: 56.0});
  event.set('location', point);

  try {
    const saved = await event.save();
    console.log('event savedd', saved);
  } catch (err) {
    console.log('erro in saving the event', err);
  }
  
}

const getLoggedInUser = () => {
  const currentUser = Parse.User.current();
  console.log(currentUser);
  return currentUser;
}

(async () => {
  // retrieveClasses();
})();


// addObject();
// retrieveObjects();