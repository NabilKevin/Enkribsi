import { useEffect, useRef, useState } from "react";

/* eslint-disable react/prop-types */
const Card = ({title, excerpt, slug, isLongClicked, setIsLongClicked}) => {
  const [isChecked, setIsChecked] = useState(false)
  const cardRef = useRef(null)
  let pressTimer

  const handleMouseDown = e => {
    handleClickCard(e)
    startTimer()
  }

  const handleClickCard = e => {
    if(isLongClicked && cardRef.current && cardRef.current.contains(e.target)) {
      setIsChecked(prev => !prev)
    }
  }

  const startTimer = () => {
    if(!isLongClicked) {
      pressTimer = setTimeout(() => {
        setIsLongClicked(true)
        setIsChecked(true)
      }, 500);
    }
  }

  const endTimer = () => {
    clearTimeout(pressTimer)
  }

  useEffect(() => {
    if(!isLongClicked) {
      setIsChecked(false)
    }
  }, [isLongClicked])

  return (
    <div className="card card-custom p-3" ref={cardRef}
      onMouseDown={handleMouseDown} 
      onTouchStart={startTimer} 
      onMouseLeave={endTimer} 
      onMouseUp={endTimer} 
      onTouchEnd={endTimer} 
    >
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="mb-2">{title}</h4>
          {isLongClicked && <input id={slug} type="checkbox" checked={isChecked} onChange={e => setIsChecked(e.target.checked)} />}
          
        </div>
        <p className="m-0 mt-3">{excerpt}</p>
        <a className="btn btn-danger" href={`/notification/${slug}`}>Cek</a>
      </div>
    </div>
  )
}

export default Card