/* eslint-disable react/prop-types */
const Page3 = ({authData, handleChangeInput, photo, handleSubmit, error}) => {
  return (
    <>
        <div className="img mt-5">
          <h2 className="text-center mb-4">Enkribsi</h2>
          <p className="text-center text-muted">Smart Attendance For Employee</p>
        </div>
        <div className="p-4 w-100" style={{ maxWidth: "600px" }}>
          <div className="alert alert-danger">
            {error?.message}
          </div>
          <form onSubmit={handleSubmit}>
          <h3 className="mb-4">Register</h3>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="email" className="form-control" id="email" placeholder="Email address" name="email" required value={authData?.email} onChange={handleChangeInput}/>
              <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="text" className="form-control" id="username" placeholder="Username" name="username" required value={authData?.username} onChange={handleChangeInput}/>
              <label htmlFor="username">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="password" className="form-control" id="password" placeholder="Password" name="password" required value={authData?.password} onChange={handleChangeInput} />
              <label htmlFor="password">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input autoComplete="off" type="hidden" className="form-control" id="photo" placeholder="Face Image" name="face_img" required value={photo}/>
              <img src={photo} alt="Captured" className="img-thumbnail mb-3"/>
            </div>
            <button type="submit" disabled={!authData.email || !authData.password || !authData.username} className={`btn btn-${(authData.email && authData.password && authData.username ? 'danger' : 'secondary')} w-100`}>Register</button>
            </form>
        </div>
        </>
  )
}

export default Page3