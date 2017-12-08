import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { firebase, provider, auth } from './utils/firebase.js';

export function AuthorizedRoute({ component: Component, authorized, appUserAuthR, useremail, newUser, userID, ...rest }) {
    console.log("Authorized : " + authorized);
    console.log("Authorized Route Props:" + appUserAuthR);
    console.log("useremail:" + useremail);
    console.log("newUser: " + newUser);
    console.log("userid" + userID);
    return <Route
        {...rest}
        render={(props) => authorized === true ? 
                newUser === false ?
                <Component {...props} appUser={appUserAuthR} authorized ={authorized} useremail={useremail} newUser ={newUser} userID={userID}/> :
    
                <Redirect to={{
                    pathname: '/settings',
                    state: { from: props.location, useremail : useremail,authorized :authorized,newUser:newUser}
                }} />
            :
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
        } />
}