import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            setError("Mohon masukkan email Anda."); // Munculkan error jika email kosong
            return;
        }

        setError(""); // Hapus error jika sudah diisi
        setMessage("Link reset password telah dikirim ke email Anda.");
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div style={{ width: "600px" }}>
                <h3 className="text-center fs-1">Enkribsi</h3>
                <p className="text-muted text-center text-capitalize">Smart Attendance for Employee</p>

                {message && <div className="alert alert-info">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>} 

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="text-capitalize">Masukkan Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Masukkan email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(""); // Hapus error saat mengetik
                            }}
                        />
                    </div>
                    
                    <div className="d-grid gap-2 mx-auto">
                        <button type="submit" className={`btn mt-3 ${email ? "btn-primary" : "btn-secondary"}`}>
                            Kirim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
00feb89