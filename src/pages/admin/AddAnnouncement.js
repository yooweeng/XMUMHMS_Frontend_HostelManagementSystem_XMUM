import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../../helper/Context';

function AddAnnouncement() {

  const month = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

  const {loginDetails, setLoginDetails} = useContext(LoginContext);
  
  const [announcementList, setAnnouncementList] = useState();
  const [addAnnouncementTitle, setAddAnnouncementTitle] = useState('');
  const [addAnnouncementDescription, setAddAnnouncementDescription] = useState('');
  const [editAnnouncementTitle, setEditAnnouncementTitle] = useState('');
  const [editAnnouncementDescription, setEditAnnouncementDescription] = useState('');

  let token = JSON.parse(sessionStorage.getItem("token"));
  let tokenType;
  
  if(token != null){
    tokenType = token.slice(0,3);
  }

  if(tokenType != 'adm'){
    setLoginDetails(prevDetails => {
      return {...prevDetails, isAuthorized: false}
    });
  }
  
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/announcement')
            .then(res => res.json())
            .then(data => {setAnnouncementList(data)})
  }, [])

  function addAnnouncement(dateTime, title, content){
    fetch('http://localhost:8080/api/v1/announcement',{
      method: 'POST',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify(
          {
            'dateTime': dateTime,
            'title': title,
            'content': content
          }
      )
    })
    .then(res => res.json())
    .then(data => data)
  }

  function updateAnnouncement(id, dateTime, title, content){
    fetch(`http://localhost:8080/api/v1/announcement/${id}`,{
      method: 'PUT',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify(
        {
            'dateTime': dateTime,
            'title': title,
            'content': content
        }
      )
    })
    .then(res => res.json())
    .then(data => data)
  }

  function deleteAnnouncement(id){
    fetch(`http://localhost:8080/api/v1/announcement/${id}`,{
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => data)
  }

  return (
    <>
        <nav className='ms-4'>
            <ol className="breadcrumb font-breadcrumb">
            <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
            <li className="breadcrumb-item active">Add Announcement</li>
            </ol>
        </nav>
        <div className='container mt-3 ps-0'>
            <h1 className='ms-4'>Announcement</h1>
            <div className='card shadow p-4 mt-4'>
                <h2 className='mt-1'>New Announcement</h2>
                <div className="row mt-4">
                    <label className="col-2 col-form-label">Announcement Title:</label>
                    <div className="col-4">
                    <input type="text" className="form-control" value={addAnnouncementTitle} onChange={e => setAddAnnouncementTitle(e.target.value)}/>
                </div>
                <div className='row mt-4'>
                    <label className="col-2 col-form-label">Description:</label>
                    <div className="col-10">
                        <textarea rows='2' className="form-control feedback-textbox" value={addAnnouncementDescription} onChange={e => setAddAnnouncementDescription(e.target.value)}/>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col'>
                      <a href='addannouncement'>
                        <button type="submit" className="btn btn-primary float-end" 
                        onClick={() => {
                          let addAnnouncementDateTime = new Date(Date.now()).toJSON();
                          addAnnouncement(addAnnouncementDateTime, addAnnouncementTitle, addAnnouncementDescription);
                          }}>
                            Add Announcement</button>
                      </a>
                    </div>
                </div>
            </div>
          </div>
          <div className='row ms-4 mt-5 p-0'>
            <h2 className='mt-1 p-0'>Current Announcement</h2>
          </div>
          <div className='row'>
          {announcementList && announcementList.map((item, index) => {
            let currentDateTime = new Date(item.dateTime);
            let currentDate = currentDateTime.getDate()+" "+month[currentDateTime.getMonth()]+" "+currentDateTime.getFullYear();
            let currentTime = currentDateTime.getHours()+":"+currentDateTime.getMinutes();

            return(
                <div className="col-6" key={item.seq_id}>
                    <div className="card shadow p-2 mt-4">
                        <div className="card-body">
                        <div className='row'>
                            <h5 className="card-title col-8">{item.title}</h5>
                            <span className='col-4 float-end'>{currentDate}</span>
                        </div>
                        <div className='row'>
                            <span className='col-4 float-end offset-8'>{currentTime}</span>
                        </div>
                        <p className="card-text mt-4 whitespace-break-line">{item.content}</p>
                        <Link to="/hostelfunction/requestchangeroom" className="btn btn-danger float-end ms-3" data-bs-toggle="modal" data-bs-target={`#modalTargetRemove${item.seq_id}`}>Remove</Link>
                        <Link to="/hostelfunction/requestchangeroom" className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target={`#modalTargetEdit${item.seq_id}`}>Edit</Link>
                        <div className="modal fade" id={`modalTargetRemove${item.seq_id}`}>
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Remove announcement</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                              </div>
                              <div className="modal-body">
                                Do you sure to remove and delete this announcement. <br/><br/>
                                The announcement will be permenantly remove and also revoke from the student announcement site.
                              </div>
                              <div className="modal-footer">
                                <a href='/addannouncement'>
                                  <button type="button" className="btn btn-success" data-bs-dismiss="modal" 
                                  onClick={() => {deleteAnnouncement(item.seq_id)}}>Yes, I confirm</button>
                                </a>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">No</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal fade" id={`modalTargetEdit${item.seq_id}`}>
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Edit Announcement</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                              </div>
                              <div className="modal-body py-4">
                                <div className="row mx-3">
                                    <label className="col-form-label">Announcement Title:</label>
                                </div>
                                <div className="row col-8 mx-3">
                                    <input type="text" className="form-control" onChange={e => setEditAnnouncementTitle(e.target.value)}/>
                                </div>
                                <div className="row mx-3 mt-3">
                                    <label className="col-form-label">Description:</label>
                                </div>
                                <div className="row mx-3">
                                    <textarea rows='10' className="form-control feedback-textbox" onChange={e => setEditAnnouncementDescription(e.target.value)}/>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <a href='/addannouncement'>
                                  <button type="button" className="btn btn-success" data-bs-dismiss="modal" 
                                  onClick={() => {
                                    let editAnnouncementDateTime = new Date(Date.now()).toJSON().toString();
                                    updateAnnouncement(item.seq_id, editAnnouncementDateTime, editAnnouncementTitle, editAnnouncementDescription);
                                  }}>
                                    Apply changes</button>
                                </a>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Back</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                    </div>
                </div>
            )
          })
          }
          </div>
        </div>
    </>
  )
}

export default AddAnnouncement
