import { handleInPopup } from "../Popup";

export const checkPermission = ({name, permitType, setShowPopup, ifGrantedFunction}) => {
  if ("permissions" in navigator) {
    navigator.permissions.query({ name }).then((permissionStatus) => {
      if (permissionStatus.state === "denied") {
        handleInPopup({title: 'Alert!', content: `Izin ${permitType} ditolak. Silakan aktifkan izin ${permitType} di pengaturan browser Anda.`, setShowPopup})
      } else if(permissionStatus.state === "granted") {
        ifGrantedFunction()
      }
  
      permissionStatus.onchange = () => {
        if (permissionStatus.state === "granted") {
          window.location.reload();
        }
      }
    });
  } else {
    console.log("Permissions API tidak didukung oleh browser ini.");
  }
}