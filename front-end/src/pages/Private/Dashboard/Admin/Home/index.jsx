/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useMultipleFetch } from "@/hooks/useMultipleFetch"
import { handleInPopup } from '@/utils/Popup'
import { Loading} from "@/components"
import AdminService from "@/services/AdminService"
import { DateComp, Table } from "@/components/Dashboard/Shared"
import { ModalBox, ModalBoxButton, PaginateButton } from "@/components/"

const Home = ({setShowPopup, children}) => {
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({
    body: '',
    title: '',
    callback: () => {}
  })
  const [search, setSearch] = useState()

  const handleError = e => {  
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }
  
  const handleChangeSearch = e => {
    setSearch(e.target.value)
  }

  const handleClickReset = () => {
    setSearch('')
    singleExecute('getEmployees', 1, '')
  }

  const handleSuccessDelete = e => {
    handleInPopup({title: 'Sukses!', content: e.message, setShowPopup})
    singleExecute('getEmployees', 1, search)
  }

  const { data, singleExecute } = useMultipleFetch({fetchs: [AdminService.getEmployees, AdminService.deleteUser], setLoading,
    errorCallbackMap: {
      getEmployees: handleError,
      deleteUser: handleError
    },
    successCallbackMap: {
      deleteUser: handleSuccessDelete
    }
  })

  const handleChangePage = (page = 1) => {
    singleExecute('getEmployees', page, search)
  }

  const detailModal = employee => {
    setModal({
      title: 'Detail user',
      body: [...Object.keys(employee)].map((key, i) => key !== 'id' && (
        <div key={i} className="d-flex flex-column gap-1 mb-2">
          <span className="fw-medium fs-5 text-capitalize">{key.split('_').join(' ')} :</span>
          <span>{employee?.[key] && typeof(employee?.[key]) !== 'object' ? employee?.[key] : '-'}</span>
        </div>
      )),
      callback: () => {}
    })
  }

  const fetch_data = () => {
    singleExecute('getEmployees')
  }
  useEffect(() => {
    import('@/css/dashboard/hr/home/index.css')
    import('@/css/dashboard/bod/home/index.css')
    fetch_data()
  }, []);

  if(loading) {
    return <Loading />
  }
  return (
    <>
    {children}
    <DateComp />
    <div>
      <h5 className="mb-4 mt-5">Semua Pegawai</h5>
      <div className="input-group mb-3">
        <input type="text" onChange={handleChangeSearch} value={search} className="form-control" placeholder="Cari Pegawai..." aria-label="Search..."/>
        <button className="btn btn-outline-dark z-0" type="button" id="button-group" onClick={handleClickReset}>Reset</button>
        <button className="btn btn-outline-dark z-0" type="button" id="button-group" onClick={() => handleChangePage()}>Cari</button>
      </div>
      <a href="/admin/create" className="w-100 btn btn-outline-dark z-0 mb-3" type="button" id="button-solo">Tambah pegawai</a>
      <hr />
      {data?.getEmployees ? data?.getEmployees?.data?.length === 0 ? 
      <>
      <h2 className="text-center mt-4">Tidak ada pegawai</h2>
      </>
       : 
       <>
       <Table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nama pegawai</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {
            data?.getEmployees?.data?.map((employee, i) => (
              <tr key={i}>
                <td data-bs-toggle="modal" data-bs-target="#modalBox" onClick={() => detailModal(employee)}>{i+1}</td>
                <td data-bs-toggle="modal" data-bs-target="#modalBox" onClick={() => detailModal(employee)}>{employee?.username}</td>
                <td>
                  <a href={`/admin/edit/${employee.id}`} className="btn btn-primary me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </a>
                  <ModalBoxButton href={`/admin/edit/${employee.username}`} className="btn btn-danger" callback={() => setModal({
                    title: 'Konfirmasi hapus!',
                    body: <span>Yakin ingin menghapus ({employee.username})?</span>,
                    callback: () => singleExecute('deleteUser', employee.id)
                  })}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </ModalBoxButton>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
      <PaginateButton datas={data.getEmployee?.links} handleChangePage={handleChangePage} bgdark={true} />
      </>
      : 
      <></>
      } 
      
      <ModalBox title={modal.title} callback={modal.callback}>
      <div className="px-2">
        {modal.body}  
      </div>
      </ModalBox>
    </div>
    </>
  )
}

export default Home