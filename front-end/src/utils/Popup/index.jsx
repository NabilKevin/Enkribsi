export const handleOutPopup = ({setShowPopup}) => {
  setShowPopup(prev => ({...prev, slide: 'out'}))
  setTimeout(() => {
      setShowPopup(prev => ({...prev, show: false}))
  }, 510)
}
export const handleInPopup = ({title, content, setShowPopup}) => {
  setShowPopup({show: true, title, content, slide: 'in'})
}
export const handleClickOutside = (e, popupRef, setShowPopup) => {
  if (popupRef.current && !popupRef.current.contains(e.target)) {
      handleOutPopup({setShowPopup});
  }
};