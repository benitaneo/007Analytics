Welcome to 007Analytics!

# Installation 

1. Clone github repository into local folder
2. Navigate to `src/containers/Full/Full.js` and change the configuration to reflect your own firebase project. 
```javascript
// Initialize Firebase<br> 
// TODO: Replace with your project's customized code snippet <br>
var config = {    
    apiKey: "AIzaSyBPweAHcP4em0PYh8XWzEqjNhTk3OBNS5I",<br>
   authDomain: "dashboard-dev-8b843.firebaseapp.com",  <br>
   databaseURL: "https://dashboard-dev-8b843.firebaseio.com", <br>
   projectId: "dashboard-dev-8b843",  
   storageBucket: "dashboard-dev-8b843.appspot.com",  
   messagingSenderId: "264557605189" 
};
```
3. Import `public/local_data.json` into your firebase database and store it directly in the root node. 
4. To host locally run `yarn` to build the dependencies then `yarn start` to start hosting locally. 
5. Navigate to root of the app and execute `yarn build` then `firebase deploy` to deploy to firebase
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.


### `firebase deploy`

Deploys the app and security rules to firebase. <br>
