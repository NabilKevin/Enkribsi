/* eslint-disable react/prop-types */
import { Loading, PaginateButton } from "@/components";
import { Table } from "@/components/Dashboard/Shared";
import HrService from "@/services/HrService";
import { handleInPopup } from '@/utils/Popup';
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { useEffect, useState } from "react";

const Statistics = ({children, setShowPopup}) => {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const handleErrorEmployees = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const { data: employees, execute: setEmployees } = useMultipleFetch({fetchs: [HrService.getEmployees], setLoading,
    errorCallbackMap: {
      getEmployees: handleErrorEmployees
    }
  })

  const handleChangePage = (page = 1) => {
    setEmployees(page, search)
  }
  const handleClickReset = () => {
    setSearch('')
    setEmployees(1, '')
  }
  
  const handleChangeSearch = e => {
    setSearch(e.target.value)
  }
  useEffect(() => {
    setEmployees()
  }, [])

  if(loading) {
    return <Loading />
  }
  return (
    <>
      {children}
      <h1 className="mb-5">Statistik</h1>
      <div className="input-group mb-3">
        <input type="text" onChange={handleChangeSearch} value={search} className="form-control" placeholder="Cari Pegawai..." aria-label="Search..."/>
        <button className="btn btn-outline-dark z-0" type="button" id="button-group" onClick={handleClickReset}>Reset</button>
        <button className="btn btn-outline-dark z-0" type="button" id="button-group" onClick={() => handleChangePage()}>Cari</button>
      </div>
      <a href="/hr/statistic" className="w-100 btn btn-outline-dark z-0 mb-3" type="button" id="button-solo">Lihat semua statistik</a>
      { 
        employees?.getEmployees?.data ? 
        <>
          <Table>
            <thead>
              <tr>
                {
                  Object.keys(employees.getEmployees.data?.[0]).map((e, i) => (
                    <th scope="col" key={i} className="text-capitalize">{e}</th>
                  ))
                }
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {
                employees.getEmployees.data?.map((employee, i) => (
                  <tr key={i}>
                    {
                      Object.values(employee).map((e, ii) => (
                        <td className="align-content-center" key={ii}>{e}</td>
                      ))
                    }
                    <td>
                      <a href={`/hr/statistic/${employee?.username}`} className="btn btn-outline-dark">Stats</a>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
          <PaginateButton datas={employees.getEmployees.links} handleChangePage={handleChangePage} />
        </>
        : 
          <h1>Tidak ada karyawan</h1>
      }
    </>
  );
}

export default Statistics;