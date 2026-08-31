import type { PublicClientApplication } from '@azure/msal-browser'
import LoginPage from './navigation/login'
import { Routes, Route } from 'react-router-dom';
import HomePage from './navigation/HomePage'

const App = ({pca}: {pca: PublicClientApplication}) => {

  return (
    <Routes>
      <Route path="/" element={<LoginPage pca={pca} />} />
      <Route path="/home" element={<HomePage pca={pca} />} />
    </Routes>
  )
}

export default App
