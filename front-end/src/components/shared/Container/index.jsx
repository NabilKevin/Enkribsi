/* eslint-disable react/prop-types */
const Container = ({children, addClass, size, marginTop, marginBottom}) => {
  return (
    <div className={`container${size ? size : ''} ${marginBottom ? `mb-${marginBottom}` : '' } ${marginTop ? `mt-${marginTop}` : ''} ${addClass ? addClass : ''}`}>
      {children}
    </div>
  )
}

export default Container