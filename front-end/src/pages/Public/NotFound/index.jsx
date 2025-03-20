import Header from "@/components/shared/Header"

/* eslint-disable react/prop-types */
const NotFound = ({setOnlyLogo, setDashboardNotfound}) => {
  setOnlyLogo(true)
  setDashboardNotfound(true)
  return (
    <>
    <Header />
    <h1 className="text-center mt-5">Page Not Found</h1>
    </>
  )
}

export default NotFound