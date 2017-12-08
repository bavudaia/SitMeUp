
This project uses CoreUI ReactJS Starter Project for initial project structure.

Libraries and Framework used in the development of this project
- ReactJS
- ChartJS/react-chartjs-2
- Reactstrap
- Firebase
- AWS-SDK
- Faye
- Moment
- ExpressJS
- Webpack
- Babel


1. Clone Repo
2. Add DynamoDB Access credentials in config.json file
3. Add Firebase Project crendentials in firebase.js
4. Add Faye Broker URL in Dashboard.js
4. Run "npm install" to install all dependencies


DEV
npm start

PROD
-- To generate build files 
npm run build 
-- To serve files and API's
node server.js


Note: All the API endpoints are defined in src/dynamodbApi
