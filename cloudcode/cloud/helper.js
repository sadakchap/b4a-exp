const axios = require('axios');
const { faker } = require('@faker-js/faker');

module.exports.generateUser = async () => {
  const username = faker.internet.userName()
  return {
    username,
    email: faker.internet.email(),
    profilePic: await getParseFileObject(faker.image.url(), username),
    password: faker.internet.password(),
  }
}

module.exports.generateEventDetails = () => {
  return {
    name: faker.music.songName(),
    desc: faker.hacker.phrase(),
    date: new Date(),
    location: new Parse.GeoPoint({latitude: faker.location.latitude(), longitude: faker.location.longitude()})
  }
}

const getParseFileObject = async (url, name) => {
  try {
    const response = await axios(url);
    
    const data = Array.from(Buffer.from(response.data, 'binary'));
    const contentType = response.headers['content-type'];
    const file = new Parse.File(name, data, contentType);
    
    const savedFile = await file.save();
    return savedFile;
  } catch (err) {
    console.log(err);
  }
}