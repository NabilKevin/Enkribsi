/* eslint-disable react/prop-types */
import { Footer } from "@/components"

const PrivateLayout = ({children}) => {
  return (
    <>
    {children}
    <Footer />
    </>
  )
}

export default PrivateLayout