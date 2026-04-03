import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ItemDetailsForm from './form_checkout/checkout'

function App() {
  const [count, setCount] = useState(0)

 return (
  <>
  <ItemDetailsForm/>
  </>
 )
}

export default App
