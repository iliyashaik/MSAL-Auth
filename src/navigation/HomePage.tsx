import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from '../authConfig';

const HomePage = ({ pca }: { pca: PublicClientApplication }) => {

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

  return (
    <div style={{
      backgroundImage: 'url(/LoggedIn.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      position: 'relative',
    }}>
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
    </div>
  )
}

export default HomePage
