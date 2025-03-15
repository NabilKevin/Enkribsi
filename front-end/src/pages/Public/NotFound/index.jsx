import Header from "@/components/shared/Header"

/* eslint-disable react/prop-types */
const NotFound = ({setOnlyLogo, setIsNotfound}) => {
  setOnlyLogo(true)
  setIsNotfound(true)
  return (
    <>
    <Header />
    <h1 className="text-center mt-5">Page Not Found</h1>
    </>
  )
}

export default NotFound