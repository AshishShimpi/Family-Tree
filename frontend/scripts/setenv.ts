
const { writeFile } = require('fs');
const { argv } = require('yargs');

//read variables from environment file
require('dotenv').config();

//read command line args passed with yargs
const environment = argv.environment;
const isProd = environment === 'prod';

const targetPath = isProd
    ? './src/environments/environment.prod.ts'
    : './src/environments/environment.ts';

//using environment variables from dotenv 
const environmentFileContent = `
    export const environment = {
        production: ${isProd},
        weatherBaseUrl: "${process.env['BACKEND_URL']}",
        
    };
`;
//writing content to respective file
writeFile(targetPath, environmentFileContent, (err : any) => {
    if (err) {
        console.log(err);
    } else if (!process.env['BACKEND_URL']) {
        console.error('All the required environment variables were not provided!');
        process.exit(-1);
    } else {
        console.log('Successfully written variables to ', targetPath);
    }
});
