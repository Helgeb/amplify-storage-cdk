import { AccessLevel, AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator, AmplifyS3Album, AmplifySignOut } from '@aws-amplify/ui-react';
import React from 'react';
import './App.css';
import './awsconfig';

const AuthStateApp = () => {
    const [authState, setAuthState] = React.useState<AuthState>(AuthState.SignedIn);
    const [user, setUser] = React.useState<object|undefined>();

    React.useEffect(() => {
        onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData);
        });
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <div className="App">
            <div>Hello, {(user as any).username}</div>
            <AmplifyS3Album level={AccessLevel.Private} />
            <AmplifySignOut />
        </div>
        ) : (
        <AmplifyAuthenticator >
        </AmplifyAuthenticator>
     );
}

export default AuthStateApp;
