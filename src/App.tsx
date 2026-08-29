import { PublicClientApplication } from '@azure/msal-browser'
import createMSALInstance from './authConfig'
import LoginPage from './navigation/login'
import { Routes, Route } from 'react-router-dom';
import HomePage from './navigation/HomePage'

// Single shared instance — never recreated across renders
const pca = new PublicClientApplication(createMSALInstance())

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<LoginPage pca={pca} />} />
      <Route path="/home" element={<HomePage pca={pca} />} />
    </Routes>
  )
}

export default App
