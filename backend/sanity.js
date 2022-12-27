
const sanityClient = require('@sanity/client')
const client = sanityClient({
  projectId: 'ggkvha42',
  dataset: 'production',
  apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
  token: 'sk1iYWd6MHCLpmd0h6QXoOXQUm8aaozbUnWeY5STXSYQro6nL2UxSLFiap6konzcziJCM2BQFKjSo7H8dler6LJDy9zCzDvrUrZcMRzK16Ri0SRJkWba7PSuN8I6QMUrF2KHmQQPK9Kins8J7YTZs75CxE4ruc6cYDIyZ3xEgtgix2cxxUSs', // or leave blank for unauthenticated usage
  useCdn: false, // `false` if you want to ensure fresh data
})

module.exports=client;

