
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
const { generateUser, generateEventDetails } = require('./helper');

Parse.Cloud.define("hello", (request) => {
	return "Hello world!";
});

Parse.Cloud.define("createEvent", async (request) => {
  const Event = Parse.Object.extend('Event');
  const event = new Event();
  event.set('name', request.params.name)
  event.set('desc', request.params.desc);
  event.set('date', new Date);
  event.set('creator', request.params.user);
  event.set('location', request.params.point);

  try {
    const saved = await event.save();
    console.log('event savedd', saved);
  } catch (err) {
    console.log('erro in saving the event', err);
  }
}
);

Parse.Cloud.define("getEvents", async () => {
  const eventQuery = new Parse.Query('Event');
  eventQuery.ascending("name");
  try {
    const results = await eventQuery.find();
    return results;
  } catch (err) {
    console.log(err);
    console.log('error in fetching events');
    return err;
  }
});


Parse.Cloud.define('testImports', async() => {
  return {user: await generateUser(), event: generateEventDetails()};
});

Parse.Cloud.job("createEventWithNewUser", async (request) => {
  const userDetails = await generateUser();
  const eventDetails = generateEventDetails();
  let savedUser;
  try {
    const User = Parse.Object.extend('_User');
    const user = new User();
    console.log('saving user...', userDetails);
    savedUser = await user.save(userDetails);
  } catch (err) {
    console.log('err in saving new user', err);
    return err;
  }

  try {
    const Event = Parse.Object.extend('Event');
    const event = new Event();
    return await event.save({
      ...eventDetails,
      creator: savedUser
    });
  } catch (err) {
    console.log('err in saving new event', err);
    return err;
  }
});

