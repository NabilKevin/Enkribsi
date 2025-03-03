import Header from "@/components/shared/Header"

/* eslint-disable react/prop-types */
const Forbidden = ({setOnlyLogo}) => {
  setOnlyLogo(true)
  return (
    <>
    <Header />
    <h1 className="text-center mt-5">Access Forbidden</h1>
    </>
  )
}

export default Forbidden