import { useEffect, useState } from 'react'
import { Footer, Navbar, ProductCard } from './components'
import { registerUser } from './features/authSlice'
import { useDispatch } from 'react-redux'
import HomePage from './pages/HomePage/HomePage'
import PublicLayout from './layouts/PublicLayout/PublicLayout'
import AdminLayout from './layouts/AdminLayout/AdminLayout'

function App() {
  const [formData, setFormData] = useState({
    fullName: "Hello user4",
    email: "hellouser4@gmail.com",
    password: "hellouser4@gmail.com"
  })

  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log("Hello");
    
  //   dispatch(registerUser(formData));
  //   console.log("Hyy");
    
  // }, [])

  return (
    <>
      
    </>
  )
}

export default App
