import React from 'react'
import { useEffect, useRef } from 'react'
import type { PublicClientApplication } from '@azure/msal-browser'
import { apiRequest, loginRequest } from '../authConfig'

const LoginPage = ({ pca }: { pca: PublicClientApplication }) => {
    const ready = useRef(false)
    // const navigate = useNavigate()

    // On page load: process the redirect response, then silently acquire a token
    useEffect(() => {
        if (ready.current) return
        ready.current = true

        pca.initialize()
            .then(() => pca.handleRedirectPromise())
            .then((response) => {
                const account = response?.account ?? pca.getAllAccounts()[0]
                if (!account) return

                return pca
                    .acquireTokenSilent({ scopes: apiRequest.scopes, account })
                    .then((tokenResponse) => {
                        console.log('Token acquired silently:')
                        // TODO: use tokenResponse.accessToken to call your API
                    })
                    .catch((error) => {
                        console.error('token acquisition failed:', error)
                    })
            })
            .catch((error) => {
                console.error('MSAL error:', error)
            })
    }, [])

    const submit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        await pca.loginRedirect(loginRequest)
    }
    return (
        <div style={{
            backgroundImage: 'url(/LoginPage.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            position: 'relative',
        }}>
            <button
                type="button"
                onClick={submit}
                style={{
                    position: 'absolute',
                    top: '56%',
                    left: '72%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#058751',
                    padding: '20px 45px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600',
                }}
            >
                <img src="/MicrosoftLogo.png" alt="" style={{ height: '18px', width: '18px' }} />
                Sign in with Microsoft
            </button>
        </div>
    )
}

export default LoginPage
