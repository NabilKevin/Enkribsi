import { handleInPopup } from "../Popup";

export const checkPermission = ({name, permitType, setShowPopup, callback}) => {
  if ("permissions" in navigator) {
    navigator.permissions.query({ name }).then((permissionStatus) => {
      if(permissionStatus.state === "granted") {
        callback()
      } else {
        handleInPopup({title: 'Peringatan!', content: `${permissionStatus.state === 'denied' ? `Izin ${permitType} ditolak. ` : ''}Silakan aktifkan izin ${permitType} di pengaturan browser Anda.`, setShowPopup})
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