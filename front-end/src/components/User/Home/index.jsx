import { ModalBoxButton } from "@/components"
import { useState } from "react"

/* eslint-disable react/prop-types */
export const ColHome = ({children}) => {
    return (
        <div className="col-md-6 d-flex align-items-center gap-3 w-100">
            {children}
        </div>
    )
}

export const FloatingButtonPulang = () => {
    const [isHover, setIsHover] = useState(false)
    return (
        <ModalBoxButton isHover={isHover} className={"float-button z-2 shadow"} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className={`bi bi-door-${isHover ? 'open' : 'closed'}`} viewBox="0 0 16 16">
              {
                  isHover ? <>
                      <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
                      <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/> 
                  </>
                      :
                  <>
                      <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z"/>
                      <path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/>
                  </>
              }
          </svg>
        </ModalBoxButton>
    )
  }