/* eslint-disable react/prop-types */
export const FooterButton = ({children, link, name}) => {
  const path = location.pathname.split('/')[1]
  return (
    <a href={link}  className={`d-flex align-items-center flex-column text-decoration-none ${path === link.slice(1, link.length) ? 'activeFooter' : ''}`}>
      {children}
      <span>{name}</span>
    </a>
  )
}