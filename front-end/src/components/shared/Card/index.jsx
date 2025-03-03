/* eslint-disable react/prop-types */
const Card = ({children, addClass, addClassBody}) => {
  return (
    <div className={`card ${addClass ? addClass : ''}`}>
      <div className={`card-body ${addClassBody ? addClassBody : ''}`}>
      {children}
      </div>
    </div>
  )
}

export default Card