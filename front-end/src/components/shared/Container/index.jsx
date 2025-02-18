/* eslint-disable react/prop-types */
const Container = ({children, addClass, size}) => {
  return (
    <div className={`container${size} my-5 ${addClass}`}>
      {children}
    </div>
  )
}

export default Container