/* eslint-disable react/prop-types */
const Card = ({children, addClass}) => {
  return (
    <div className={`card ${addClass}`}>
      <div className="card-body">
      {children}
      </div>
    </div>
  )
}

export default Card