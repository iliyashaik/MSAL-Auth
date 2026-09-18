import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, backEndApiRequest } from '../authConfig';
import { useEffect, useState } from 'react';

const HomePage = ({ pca }: { pca: PublicClientApplication }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const initialize = async () => {
        await pca.initialize();
        const loginRequest = { scopes: backEndApiRequest.scopes, account: pca.getAllAccounts()[0] };
        await pca.acquireTokenSilent(loginRequest)
          .then((tokenResponse) => {
            setToken(tokenResponse.accessToken)
          })
          .catch((error) => {
            console.error('token acquisition failed:', error)
          })
      };
      initialize();
    }, 100);
  }, []);

  const logOut = async () => {
    sessionStorage.clear();
    await pca.initialize();
    pca.logoutRedirect({
      postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri
    }).then(() => {
      console.log('Logged out successfully')
    }).catch(error =>
      console.error(error)
    );
  }

  const getUsersList = async () => {
    // fetch(apiConfig.usersUrl, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    // }
    // ).then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error(error));
    await fetch("msal-auth-backend-gyhqgsc9f9g6dqb3.swedencentral-01.azurewebsites.net/api/verifyToken", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => response.json())
      .then(data => {
        setIsTokenValid(data?.message);
      })
      .catch(error => {
        console.error(error)
        setIsTokenValid(null);
      });
  };

  return (
    <div style={{
      backgroundImage: 'url(/LoggedIn.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      position: 'relative',
    }}>
      {isTokenValid !== null && (
        <div style={{
          position: 'absolute',
          top: '47%',
          left: '80%',
          transform: 'translateX(-50%)',
          color: '#F44336',
          padding: '10px 20px',
          borderRadius: '4px',
        }}>
          {isTokenValid ? 'Token is valid. Verified successfully.' : 'Token is invalid'}
        </div>
      )}

      <button
        type="button"
        onClick={logOut}
        style={{
          position: 'absolute',
          top: '26%',
          left: '80%',
          transform: 'translateX(-50%)',
          backgroundColor: '#871205',
          padding: '20px 45px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600',
        }}>
        <img src="/MicrosoftLogo.png" alt="" style={{ height: '18px', width: '18px' }} />
        LogOut from Microsoft
      </button>

      <button
        type="button"
        onClick={getUsersList}
        style={{
          position: 'absolute',
          top: '40%',
          left: '80%',
          transform: 'translateX(-50%)',
          backgroundColor: '#871205',
          padding: '20px 45px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600',
        }}>
        Validate Azure Token
      </button>
    </div>
  )
}

export default HomePage
