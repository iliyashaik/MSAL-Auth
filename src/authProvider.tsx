import type { PublicClientApplication } from '@azure/msal-browser';
import { useEffect } from 'react';


export const AuthProvider = ({ children, pca }: { children: React.ReactNode, pca: PublicClientApplication }) => {
    useEffect(() => {
        const initializeMSAL = async () => {
            await pca.initialize();
            pca.handleRedirectPromise({ navigateToLoginRequestUrl: false }).then((response) => {
                const account = response?.account ?? pca.getAllAccounts()[0];
                if (!response?.account) {
                    return;
                }
                pca.setActiveAccount(account);
            }).catch((error) => {
                console.error(`MSAL Session Creation Error: ${error}`);
            })
        }
        initializeMSAL();
    }, [])

    return (<>{children}</>)
}