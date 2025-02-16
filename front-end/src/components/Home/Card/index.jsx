/* eslint-disable react/prop-types */
const Card = ({children, addClass}) => {
  return (
      <div className={`card text-white w-100 m-0 mt-3 ${addClass}`}>
          <div className="card-body">
              {children}
          </div>
      </div>
  )
}

export default Card