
const sanityClient = require('@sanity/client');

require('dotenv').config();

const client = sanityClient({
  projectId: 'ggkvha42',
  dataset: 'production',
  apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
  token: process.env.SANITY_TOKEN, // or leave blank for unauthenticated usage
  useCdn: false, // `false` if you want to ensure fresh data
})

module.exports=client;

