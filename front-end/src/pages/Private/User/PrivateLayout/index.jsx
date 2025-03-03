/* eslint-disable react/prop-types */
import { Footer, Header } from "@/components"

const PrivateLayout = ({children}) => {
  return (
    <>
    <Header /> 
    {children}
    <Footer />
    </>
  )
}

export default PrivateLayout