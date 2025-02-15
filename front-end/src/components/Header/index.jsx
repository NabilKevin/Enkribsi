
/* eslint-disable react/prop-types */
const Header = ({isHomepage, user, showNotificationButton}) => {
  const path = location.pathname.split('/')[1].toLowerCase()
  const onlyLogoPath = ['login', 'addphoto']
  
  return (
    <div className="header position-fixed top-0 start-0 end-0 z-1">
        <div className="d-flex align-items-center justify-content-between">
        {!showNotificationButton && <div>
            {
              !showNotificationButton && !onlyLogoPath.includes(path) &&
              <a href="" className="text-decoration-none d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                </svg>
              </a>
            }
          </div>}
          <a href="/" className="text-decoration-none text-white"><h2 className="m-0">Enkribsi</h2></a>
          <div>
            {
              showNotificationButton && !onlyLogoPath.includes(path) &&
              <a href="" className="text-decoration-none d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-bell-fill" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
                </svg>
              </a>
            }
          </div>
        </div>
          {
            isHomepage && <div className="w-100 d-flex align-items-center justify-content-center">
              <div className="mt-4 d-flex bg-light gap-3 align-items-center text-dark p-3 rounded fs-5 fw-medium w-100" style={{ maxWidth: '1000px' }}>
                    <span>Halo, {user?.username}!</span>
              </div>
            </div>
          }
      </div>
  )
}

export default Header