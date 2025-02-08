import { useEffect, useState } from "react"

const Header = () => {
  const [isHomepage, setIsHomepage] = useState(false)
  useEffect(() => {
    const path = location.pathname
    if(path === '/') {
      setIsHomepage(true)
    }
  }, [])
  return (
    <div className="header">
          <a href="/" className="text-decoration-none text-white"><h2>Enkribsi</h2></a>
          {
            isHomepage && <div className="w-100 d-flex align-items-center justify-content-center">
              <div className="mt-4 d-flex flex-column justify-content-center bg-light text-dark p-3 rounded fs-5 fw-medium w-100" style={{ maxWidth: '1000px' }}>
                  <span>
                    <img src="" alt="" />
                    Halo
                  </span>
                  <span>Nama karyawan</span>
              </div>
            </div>
          }
      </div>
  )
}

export default Header