/* eslint-disable react/prop-types */
import Footer from "@/components/Footer"

const PrivateLayout = ({children}) => {
  return (
    <>
    {children}
    <Footer />
    </>
  )
}

export default PrivateLayout