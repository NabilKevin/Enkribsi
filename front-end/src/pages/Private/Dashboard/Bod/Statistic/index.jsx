/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BodService from '@/services/BodService'
import { handleInPopup } from '@/utils/Popup';
import { Loading, Piechart, Barchart, PaginateButton, ModalBox, ModalBoxButton } from '@/components';
import { Table } from "@/components/Dashboard/Shared";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';

const Statistic = ({children, setShowPopup, setIsNotfound}) => {
  const {username} = useParams()
  const [loading, setLoading] = useState(true)
  const [graphicData, setGraphicData] = useState({})
  const [chart, setChart] = useState(false)
  const [range, setRange] = useState({range: 'monthly'});
  const [modalContent, setModalContent] = useState()

  const handleErrorUser = e => {
    if(e.status === 404) {
      setIsNotfound(true)
    }
    setGraphicData(null)
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }

  const {data, singleExecute} = useMultipleFetch({fetchs: [BodService.getAttendances], setLoading,
    errorCallbackMap: {
      getAttendances: handleErrorUser
    }
  })

  const handleEditRange = obj => {
    if(obj?.range !== range?.range) {
      setRange({...obj})
    }
  }

  const handleInputDate = e => {
    if(e.target.value === '') {
      e.target.value = getTodayDate()
    }
  }

  const handleChangePage = (page = 1) => {
    singleExecute('getAttendances', {username, ...range, page})
  }

  const getTodayDate = () => {
    const d = new Date();
    const date = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    
    return date.map(e => e < 10 ? `0${e}` : e).join('-')
  }

  const handleEditCustom = e => {
    e.preventDefault();
    const dates = [...e.target].map(inp => inp.value).filter(inp => inp !== '');
    setRange({
      start_date: dates[0],
      end_date: dates[1]
    })
  }

  const handleChangeChart = () => {
    setChart(prev => !prev)
  }

  useEffect(() => {
    if(range) {
      singleExecute('getAttendances', {username, ...range})
    }
  }, [range])
  

  useEffect(() => {
    if(data.getAttendances) {
      
      const { ...newObj } = data.getAttendances;
      delete newObj.data;
      setGraphicData(newObj)
    }
    
  }, [data.getAttendances])

  if(loading) {
    return <Loading />
  }

return (
  <>
      {children}
      <div className="d-flex w-100 align-items-center justify-content-between mb-3">
        <h1 className="m-0">Statistik</h1>
        <div className="btn-group z-0" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" checked={!chart} onChange={handleChangeChart} />
          <label className="btn btn-outline-dark" htmlFor="btnradio2">Lingkaran</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" checked={chart} onChange={handleChangeChart} />
          <label className="btn btn-outline-dark" htmlFor="btnradio1">Batang</label>
        </div>
      </div>
      <hr />
      <div className="w-100 d-flex align-items-center justify-content-center flex-column gap-2 mb-4">
      {
      graphicData && <div className="graphic mb-2">
      {
        !chart ? <Piechart statistics={graphicData} /> : <Barchart statistics={graphicData} />
      }
      </div>
      }
      <div className="d-flex align-items-center mb-2 flex-column">
        <span><strong>Rentang waktu :</strong></span>
        <span>{data.getAttendances?.start_date} - {data.getAttendances?.end_date}</span>
      </div>
      <div className="d-flex flex-column">
        <div className="dates d-flex w-100 align-items-center gap-2 justify-content-center">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className={`btn btn${range?.range === 'daily' ? '' : '-outline'}-dark`} onClick={() => handleEditRange({range: 'daily'})}>Harian</button>
            <button type="button" className={`btn btn${range?.range === 'weekly' ? '' : '-outline'}-dark`} onClick={() => handleEditRange({range: 'weekly'})}>Mingguan</button>
            <button type="button" className={`btn btn${range?.range === 'monthly' ? '' : '-outline'}-dark`} onClick={() => handleEditRange({range: 'monthly'})}>Bulanan</button>
          </div>
          <div className="dropdown">
            <button className="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
            <form onSubmit={handleEditCustom}>
            <ul className="dropdown-menu px-3" style={{ width: 'max-content' }}>
              <li>Tanggal lain : </li>
              <li><hr className="my-2" /></li>
              <li>
                <div className="d-flex flex-column gap-1">
                  <div className="d-flex flex-column gap-1">
                    <label htmlFor="start-date" style={{ width: 'max-content' }}>Tanggal awal : </label>
                    <input onBlur={handleInputDate} required defaultValue={getTodayDate()} name="start-date" style={{ minWidth: '175px' }} id="start-date" className="form-control" type="date" />
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <label htmlFor="end-date" style={{ width: 'max-content' }}>Tanggal akhir : </label>
                    <input onBlur={handleInputDate} required defaultValue={getTodayDate()} name="end-date" style={{ minWidth: '175px' }} id="end-date" className="form-control" type="date" />
                  </div>
                </div>
              </li>
              <li><hr className="my-2" /></li>
              <li>
                <button className="btn btn-dark" type="submit">Terapkan</button>
              </li>
            </ul>
            </form>
          </div>
        </div>
      </div>
      </div>
      {
        graphicData && <>
          <hr />
          <div className="p-0">
            <Table>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Username</th>
                  <th scope="col">Status</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.getAttendances?.data?.data &&
                  data.getAttendances.data.data.map((d, i) => (
                    <tr key={i}>
                      <th scope="row">{i + 1 + ((data.getAttendances.data.current_page-1) * 10)}</th>
                      <td>{d.username}</td>
                      <td>{d.status}</td>
                      <td><ModalBoxButton className="btn btn-dark" callback={() => setModalContent(d)}>Detail</ModalBoxButton></td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
            <PaginateButton datas={data.getAttendances.data.links} handleChangePage={handleChangePage} />
          </div>
          <ModalBox title='Detail Kehadiran'>
          <div className="px-2">
            {
              data?.getAttendances && modalContent && Object.keys(data?.getAttendances?.data?.data[0]).map((value, i) => 
              <div key={i} className="d-flex flex-column gap-1 mb-2">
                <span className="fw-medium fs-5 text-capitalize">{value.split('_').join(' ')} :</span>
                <span className="text-capitalize">{modalContent?.[value] && typeof(modalContent?.[value]) !== 'object' ? modalContent?.[value] : '-'}</span>
              </div>
              ) 
            }
            </div>
          </ModalBox>
        </> 
      }
    </>
  )
}

export default Statistic
