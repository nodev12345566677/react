import React, { useEffect, useState } from 'react'
import Header from '../Header'
import {Form,   Table } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import Select from 'react-select';
import { BASE_URL } from '../../env';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/joy';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import EventIcon from '@mui/icons-material/Event';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Checkbox, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from 'react-bootstrap/Modal';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const options = [
  { value: '3', label: 'All' },
  { value: '0', label: 'Pending' },
  { value: '1', label: 'Completed' },
  { value: '2', label: 'Rejected' },
  { value: '4', label: 'Awarded' },
];


const Work = () => {

  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [updateStatus,setUpdateStatus] = useState();
  const [data,setData] = useState([]);
  const Navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [show1, setShow1] = useState(false);
  const [selectedData,setSelectedData] = useState('');
  const [block, setBlock] = useState("");
  const [official,setOfficial] = useState("");

  const [village, setVillage] = useState("");
  const [BlockData, setBlockData] = useState([]);
  const [VillageData, setVillageData] = useState([]);
  const [OfficialData, setOfficialData] = useState([]);

  const [open1, setOpen1] = React.useState(false);

  const isMobileOrTablet = useMediaQuery({
    query: "(max-width: 968px)",
  });

  const handleClose1 = () =>{
    setShow1(false);
    setSelectedData('');
  } 
  const handleShow1 = (id) => {
    setShow1(true);
    setSelectedData(id);
  }
  const handleClose = () =>{
    setShow(false);
    setSelectedItem(null);
  }
    
  const handleShow = (item) => {
    console.log(item)
    const startDate = new Date(item.start_date);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const completionDate = new Date(item.completion_date);
    const formattedCompletionDate = completionDate.toISOString().split('T')[0];
  
    setSelectedItem({
      ...item,
      start_date: formattedStartDate,
      completion_date: formattedCompletionDate
    });
    setShow(true);
  }

  const getProjects = async()=>{
    try{
      const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

const raw = JSON.stringify({
  "type": selectedOption
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

 const response = await fetch(`${BASE_URL}/get/projects`, requestOptions);
 const result = await response.json();
 if(result.status==="001"){
  console.log(result.projects);
  setData(result.projects)
  setBlock("");
  setVillage("");
  setOfficial("");
 }else if(result.status==="003") {
  localStorage.removeItem("token");
  localStorage.removeItem("name")
  Navigate("/");
 }

    }catch(e){  
      console.log(e);
    }
  }

  const complete = async()=>{
    try{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

      const raw = JSON.stringify({
        "project_id": selectedData
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/complete/project`, requestOptions);
      const result = await response.json();

      if(result.status=="002"){
        handleClose1();
        getProjects();
        setSelectedData('');
      }else if(result.status==="003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name")
        Navigate("/");
       }

    }catch(e){
      console.log(e);
    }
  }
  const reject = async()=>{
        try{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

      const raw = JSON.stringify({
        "project_id": selectedData
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/reject/project`, requestOptions);
      const result = await response.json();

      if(result.status=="002"){
        handleClose1();
        getProjects();
        setSelectedData('');
      }else if(result.status==="003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name")
        Navigate("/");
       }

    }catch(e){
      console.log(e);
    }
  }
  const award = async(id)=>{
    try{
      const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

const raw = JSON.stringify({
  "project_id": id
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

const response = await fetch(`${BASE_URL}/award/project`, requestOptions)
const result = await response.json();
  if(result.status=="002"){
    getProjects();
  }else if(result.status==="003") {
    localStorage.removeItem("token");
    localStorage.removeItem("name")
    Navigate("/");
   }
    }catch(e){
      console.log(e);
    }
  }

  const handleAward=(id)=>{
    award(id)
  }



  const getBlock = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/block`,
        requestOptions
      );
      const result = await response.json();
      if (result.status == "001") {
        setBlockData(result.Block);
      } else if (result.status == "003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        Navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getvillage = async (block_id) => {
    try {
      setBlock(block_id);
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/villages?block_id=${block_id}`,
        requestOptions
      );
      const result = await response.json();
      if (result.status == "001") {
        
        setVillageData(result.villages);
      } else if (result.status == "003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        Navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getOfficial = async (village_id) => {
    try {
      setVillage(village_id);
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/get/official?village_id=${village_id}`,
        requestOptions
      );
      const result = await response.json();
      if (result.status == "001") {
        console.log(result);
        setOfficialData(result.officials);
      } else if (result.status == "003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        Navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const FilterOfficial = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const raw = JSON.stringify({
        block_id: block,
        village_id: village,
        official_id:official

      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(`${BASE_URL}/filter/project`, requestOptions);
      const result = await response.json();
      if (result.status == "001"){ 
        setData(result.projects);
        setBlock(block);
        setVillage(village);
        setOfficial(official);
      } else if (result.status == "VAL_ERR") {
        setOpen1(true);
      } else if (result.status == "003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        Navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const Reset = async () => {
    try {
     
      getProjects();
        
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getProjects();
    getBlock();
  }, [selectedOption])
  

  return (


    
    <>
        <div className='example'
        style={{ display: "flex", flexDirection: "column", height: "100vh",overflowY:"auto" }}
      >
        <Header heading="Rural Development Department" />
        <div className="container h-100 pt-3" style={{flexGrow:1}} >
          <div className='row' style={{padding:"24px"}} >
            <div className='col-lg-8 col-md-8 col-sm-12' >
            <h3 className="mb-0">
        Works/Projects
              </h3>
            </div>
                          <div className="row d-flex justify-content-between">
                            <Form className="d-flex flex-fill">
                              <Form.Group className="col-md-3 mb-3" controlId="formGroupBlock">
                                <Form.Label>Block</Form.Label>
                                <Form.Select
                                value={block}
                                  onChange={(e) => {
                                    getvillage(e.target.value);
                                  }}
                                  aria-label="Default select example"
                                >
                                  <option hidden selected>
                                  Select Block
                                  </option>
                                  {
                                            BlockData?.map((res)=>{
                                              return(
                                                <>
                                                  <option value={res?.id}>{res?.blockName}</option>
                                                </>
                                              )
                                            })
                                        }
                                
                                </Form.Select>
                              </Form.Group>
                              <Form.Group className="col-md-3 mb-3 mx-3" controlId="formGroupVillage">
                                <Form.Label>Panchyat Halqa</Form.Label>
                                <Form.Select
                                value={village}
                                  onChange={(e) => {
                                    getOfficial(e.target.value);
                                    
                                    
                                  }}
                                  aria-label="Default select example"
                                >
                                  <option hidden selected>
                                  Select Panchyat Halqa
                                  </option>
                                  {
                                            VillageData?.map((res)=>{
                                              return(
                                                <>
                                                  <option value={res?.id}>{res?.villageName}</option>
                                                </>
                                              )
                                            })
                                        }
                                
                                
                                </Form.Select>
                              </Form.Group>
                              <Form.Group className="col-md-3 mb-3 mx-3" controlId="formGroupOfficial">
                                <Form.Label>Official</Form.Label>
                                <Form.Select
                                value={official}
                                  onChange={(e) => {
                                    setOfficial(e.target.value);
                                    
                                    
                                  }}
                                  aria-label="Default select example"
                                >
                                  <option hidden selected>
                                  Select Official
                                  </option>
                                  {
                                            OfficialData?.map((res)=>{
                                              return(
                                                <>
                                                  <option value={res?.id}>{res?.firstName+" "+ res?.lastName}</option>
                                                </>
                                              )
                                            })
                                        }
                                
                                
                                </Form.Select>
                              </Form.Group>

                              <div class="col-md-3 mt-3">
                              <button type="button"onClick={FilterOfficial} className="btn btn-primary">
                                      Search
                                  </button>
                                  <button type="button" onClick={Reset} className="btn btn-info mx-2 text-light">
                                    Reset
                                  </button>
                              </div>
         
                            </Form>
                          </div>
          

            <div className="col-12 bg-white das-card mt-4"  >
            {data.length <= 0 ? (
                      <h3 className="text-danger text-center">
                        Currently No Data Found
                      </h3>
                    ) :(

              <Table className="w-100" responsive >
            <thead>
              <tr>
                <th
                  className="p-1"
                   style={{ fontWeight: 500 }}
                >
                  S.no
                </th>
                <th
                  className="p-1"
                   style={{ fontWeight: 500 }}
                >
                  Name of work/Project
                </th>
                <th
                  className="p-1"
                   style={{ fontWeight: 500 }}
                >
                 Allotted Cost
                </th>
                <th
                  className="p-1"
                   style={{ fontWeight: 500 }}
                >
                  Start Date
                </th>
                <th
                  className="p-1"
                   style={{ fontWeight: 500 }}
                >
                  Images
                </th>
                <th
                  className="p-1"
                   style={{ fontWeight: 500 }}
                >
                  Award
                </th>
                <th
                  className="p-1"
                   style={{ fontWeight: 500 }}
                >
                  Status
                </th>

                <th
                  className="p-1"
                   style={{ fontWeight: 500 }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="w-100" >

            {data.length <= 0 ? (
                      <h3 className="text-danger text-center">
                        Currently No Data Found
                      </h3>
                    ) :(
<>

            {
              data?.map((key,value)=>{
                const startDate = new Date(key.start_date);
    const formattedStartDate = startDate.toISOString().split('T')[0];
                return(

              <tr key={value} style={{verticalAlign:"middle"}} >
                  <td>{value+1}</td>
                  <td>{key.work_title}</td>
                  <td>₹ {key.allotted_cost}</td>
                  <td>
                  <Button color="neutral" size="sm" variant="soft" startDecorator={<EventIcon   />}>{formattedStartDate}</Button>
                  
                  </td>
                  <td>
                  <AvatarGroup total={4} sx={{justifyContent:"start"}} >
  <Avatar alt="Remy Sharp" src={ key.photo1} />
  <Avatar alt="Travis Howard" src={ key.photo2} />
  <Avatar alt="Agnes Walker" src={ key.photo3} />
  <Avatar alt="Trevor Henderson" src={ key.photo4} />
</AvatarGroup>
                  </td>
                  <td>
                  {
                    key.project_status==4?<>
                  <Checkbox icon={<FavoriteBorder />} checked checkedIcon={<Favorite />}  defaultChecked readOnly />
                    </>:<>
                    <Checkbox icon={<FavoriteBorder />}  checkedIcon={<Favorite />} onChange={()=>{
                      handleAward(key.id)
                    }}   />
                    </>
                  }
                  </td>
                  <td>
                  <span className="px-2 py-1" style={{
                                background:
                                key.project_status == 0
                                    ? "#FAFFE5"
                                    : key.project_status== 1?"#E5FFF2":key.project_status==2?"#FFE5E5":"#FFF3E5",
                                color:
                                key.project_status == 0
                                    ? "#C3BC16"
                                    : key.project_status== 1?"#16C37A":key.project_status==2?"#C31616":"#C37E16",
                                borderRadius: "8px",
                              }} >
                  {key.project_status===0?"Pending":key.project_status===1?"Completed":key.project_status===2?"Rejected":"Awarded"}

                  </span>
                  </td>
                  <td>
                  <div className='d-flex gap-2 align-items-center'>
                  <Tooltip title="Update Status" >
                    <ChangeCircleIcon color='primary' sx={{fontSize:"2rem",cursor:"pointer"}} onClick={()=>{handleShow1(key.id)}} />
                  </Tooltip>
                  <Tooltip title="View Details" >
                    <MoreVertIcon color='primary' onClick={()=>{handleShow(key)}} sx={{fontSize:"2rem",cursor:"pointer"}} />
                  </Tooltip>
                  </div>
                  {/* <button className='btn btn-primary' onClick={()=>{handleShow(key)}} >View Details</button> */}
                  </td>

              </tr>
                )
              })
            }
</>
                    )
            }
              
            </tbody>
          </Table>
                    )
            }
      </div>
           
          </div>
        </div>

        {/* view details modal started */}
        
      <Offcanvas show={show} onHide={handleClose} placement='end' backdrop="static" style={{width:isMobileOrTablet?"100%":"35%"}} >
        <Offcanvas.Header closeButton style={{borderBottom:"1px solid"}} >
          <Offcanvas.Title>Project</Offcanvas.Title>
        </Offcanvas.Header>
      {
        selectedItem && (
          <>
        <Offcanvas.Body>
        <div className='mb-2' >

        <p className='mb-0' >

        Title : 
        </p>
        <h3>
          {selectedItem.work_title}
        </h3>
        </div>
       
        <div className='mb-2' >

        <p className='mb-0' >

        Remark : 
        </p>
        <h3>
          {selectedItem.remarks}
        </h3>
        </div>
        <div className='mb-2'>

          <div>
            <p className="mb-0" >Lattitude : </p>
        <h5>
          {selectedItem.lat}
        </h5>
          </div>
          <div>
            <p className='mb-0' >Longitude : </p>
        <h5>
          {selectedItem.long}
        </h5>
          </div>
        </div>
        <div className='d-flex align-items-center mb-2' >
            <div className='flex-grow-1' >
              <p className='mb-0' >
                Allotted Cost
              </p>
              <h5>
              <Button color="neutral" size="sm" variant="soft">₹ {selectedItem.allotted_cost}</Button>
              </h5>
            </div>
            <div className='flex-grow-1' >
              <p className='mb-0' >
                Estimatted Cost
              </p>
              <h5>
              <Button color="neutral" size="sm" variant="soft">₹ {selectedItem.estimated_cost}</Button>
              </h5>
            </div>
        </div>
        <div className='d-flex align-items-center mb-2' >
            <div className='flex-grow-1' >
              <p className='mb-0' >
                Start Date
              </p>
              <h5>
              <Button color="neutral" size="sm" variant="soft" startDecorator={<EventIcon   />}>{selectedItem.start_date}</Button>
              </h5>
            </div>
            <div className='flex-grow-1' >
              <p className='mb-0' >
                End Date
              </p>
              <h5>
              <Button color="neutral" size="sm" variant="soft" startDecorator={<EventIcon   />}>{selectedItem.completion_date}</Button>
              </h5>
            </div>
        </div>

        <div>
          {/* <p className='mb-0' >
            Images
          </p>
          <div className='container' >
            <div className='row' style={{rowGap:"10px"}} >
              <div className='col-12' >
                  {
                    selectedItem.photo1?<>
                      <img alt='s' style={{height:"100px",width:"100%",objectFit:"cover"}} src={selectedItem.photo1} />
                    </>:<></>
                  }
              </div>
              <div className='col-12' >
                  {
                    selectedItem.photo2?<>
                      <img alt='s' style={{height:"100px",width:"100%",objectFit:"cover"}} src={selectedItem.photo2} />
                    </>:<></>
                  }
              </div>
              <div className='col-12' >
                  {
                    selectedItem.photo3?<>
                      <img alt='s' style={{height:"100px",width:"100%",objectFit:"cover"}} src={selectedItem.photo3} />
                    </>:<></>
                  }
              </div>
              <div className='col-12' >
                  {
                    selectedItem.photo4?<>
                      <img alt='s' style={{height:"100px",width:"100%",objectFit:"cover"}} src={selectedItem.photo4} />
                    </>:<></>
                  }
              </div>
            </div>
          </div> */}
          
        </div>
        </Offcanvas.Body>
          </>
        ) 
      }
      </Offcanvas>



      {/* update status modal started  */}
      <Modal
        show={show1}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className='border-0' >
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <select className='w-100 py-2 px-2' style={{borderRadius:"10px"}} onChange={(e)=>setUpdateStatus(e.target.value)} >
        <option hidden selected >--pls select status--</option>
            <option value="1">Complete</option>
            <option value="2">Reject</option>
          </select>
        </Modal.Body>
        <Modal.Footer className='border-0' >
        <button className='w-100 btn btn-primary mt-2' onClick={()=>{
            {
              if(updateStatus==1){
                complete();
              }else if(updateStatus==2){
                reject();
              }
              
            }
          }} disabled={updateStatus<=0?true:false} >Proceed</button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  )
}

export default Work
