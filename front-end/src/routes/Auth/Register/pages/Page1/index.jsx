/* eslint-disable react/prop-types */
const Page1 = ({authData, handleChangeInput, handleClickLanjut}) => {
  return (
    <>
      <div className="mt-5">
        <h2 className="text-center mb-4">Enkribsi</h2>
        <p className="text-center text-muted">Smart Attendance For Employee</p>
      </div>
      <div className="p-4 w-100" style={{ maxWidth: "600px" }}>
        <h3 className="mb-4">Register</h3>
          <div className="form-floating mb-3">
            <input autoComplete="off" type="email" className="form-control" id="email" placeholder="Email address" name="email" required value={authData.email} onChange={handleChangeInput}/>
            <label htmlFor="email">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input autoComplete="off" type="text" className="form-control" id="floatingusernameInput" placeholder="Username" name="username" required value={authData.username} onChange={handleChangeInput}/>
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input autoComplete="off" type="password" className="form-control" id="password" placeholder="Password" name="password" required value={authData.password} onChange={handleChangeInput} />
            <label htmlFor="password">Password</label>
          </div>
          <button disabled={!authData.email || !authData.password || !authData.username} className={`btn btn-${(authData.email && authData.password && authData.username ? 'danger' : 'secondary')} w-100`} onClick={handleClickLanjut}>Lanjutkan</button>
          <div className="text-center mt-3 d-flex align-items-center justify-content-between">
            <span>Already have an account? <a href="/login" className="text-muted">Login here!</a>
            </span>
          </div>
      </div>
    </>
  )
}

export default Page1