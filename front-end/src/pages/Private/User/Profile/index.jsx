import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    useEffect(() => {
        import ("@/css/Profile/index.css");
    }, []); // Tambahkan dependensi array agar `useEffect` hanya berjalan sekali.

    const navigate = useNavigate();

    const handleLogout = () => {
        // Hapus token dari localStorage
        localStorage.removeItem("token");

        // Arahkan pengguna ke halaman login
        navigate("/");
    };

    return (
        <>
            <div className="container">
                <div className="profil-picture-container">
                    <div className="profile-pic">
                        <img src="path/to/default/profile/picture.png" alt="Profile Picture" />
                    </div>
                </div>
                <div className="form-container">
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Masukan Email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="Masukan Username" />
                        </div>
                        <div className="mx-auto">
                            <button type="button" className="btn btn-red btn-block btn-md" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile
    