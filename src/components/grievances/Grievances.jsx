import React, { useEffect, useState } from "react";
import Header from "../Header";
import { BASE_URL } from "../../env";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Offcanvas, Table } from "react-bootstrap";
import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Modal from "react-bootstrap/Modal";
import { Chip } from "@mui/joy";
import { useMediaQuery } from "react-responsive";


const Grievances = () => {
  const [data, setData] = useState([]);
  const Navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedItem,setSelectedItem] = useState(null)
  const handleClose = () => {
    setStatus("");
    setCurrent("");
    setShow(false);
  };
  const handleShow = (id) => {
    setCurrent(id);
    setShow(true);
  };

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => {
    setShow1(false);
    setSelectedItem(null)
  };
  const handleShow1 = (key) => {
    setShow1(true);
    setSelectedItem({...key})
  };

  const options = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Completed" },
    { value: "2", label: "Rejected" },
  ];

  const isMobileOrTablet = useMediaQuery({
    query: "(max-width: 968px)",
  });

  const [selectedOption, setSelectedOption] = useState(options[0].value);

  const api = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const raw = JSON.stringify({
        type: selectedOption,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/get/grievances`,
        requestOptions
      );
      const result = await response.json();
      if (result.status == "001") {
        setData(result.grievances);
      } else if (result.status === "003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        Navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const reject = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const raw = JSON.stringify({
        grievance_id: current,
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/reject/grievance`,
        requestOptions
      );
      const result = await response.json();
      if (result.status == "002") {
        api();
        handleClose();
        setCurrent("");
        setStatus("");
      } else if (result.status == "003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        Navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const close = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const raw = JSON.stringify({
        grievance_id: current,
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/close/grievance`,
        requestOptions
      );
      const result = await response.json();
      if (result.status == "002") {
        api();
        handleClose();
        setCurrent("");
        setStatus("");
      } else if (result.status == "003") {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        Navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    api();
  }, [selectedOption]);

  return (
    <>
      <div
        className="example"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Header heading="Rural Development Department" />
        <div className="container h-100 pt-3" style={{ flexGrow: 1 }}>
          <div className="row" style={{ padding: "24px" }}>
            <div className="col-lg-8 col-md-8 col-sm-12">
              <h3 className="mb-0">Grievances</h3>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-12">
              <Select
                className="w-100"
                value={options.find(
                  (option) => option.value === selectedOption
                )}
                onChange={(option) => setSelectedOption(option.value)}
                options={options}
              />
            </div>

            <div className="col-12 bg-white das-card mt-4">
              {data.length <= 0 ? (
                <h3 className="text-danger text-center">
                  Currently No Data Found
                </h3>
              ) : (
                <Table className="w-100" responsive>
                  <thead>
                    <tr>
                      <th className="p-1" style={{ fontWeight: 500 }}>
                        S.no
                      </th>
                      <th className="p-1" style={{ fontWeight: 500 }}>
                        Title
                      </th>
                      <th className="p-1" style={{ fontWeight: 500 }}>
                        Village Name
                      </th>
                      <th className="p-1" style={{ fontWeight: 500 }}>
                        Images
                      </th>
                      <th className="p-1" style={{ fontWeight: 500 }}>
                        Status
                      </th>

                      <th className="p-1" style={{ fontWeight: 500 }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="w-100">
                    {data.length <= 0 ? (
                      <h3 className="text-danger text-center">
                        Currently No Data Found
                      </h3>
                    ) : (
                      <>
                        {data?.map((key, value) => {
                          return (
                            <tr key={value} style={{ verticalAlign: "middle" }}>
                              <td>{value + 1}</td>
                              <td>{key.grie_title}</td>
                              <td>
                                <Chip
                                  startDecorator={
                                    <LocationOnIcon
                                      style={{ fontSize: "0.9rem" }}
                                    />
                                  }
                                  variant="outlined"
                                  color="primary"
                                >
                                  {key.villageName}
                                </Chip>
                              </td>
                              <td>
                                <AvatarGroup
                                  total={4}
                                  sx={{ justifyContent: "start" }}
                                >
                                  <Avatar alt="Remy Sharp" src={key.photo1} />
                                  <Avatar
                                    alt="Travis Howard"
                                    src={key.photo2}
                                  />
                                  <Avatar alt="Agnes Walker" src={key.photo3} />
                                  <Avatar
                                    alt="Trevor Henderson"
                                    src={key.photo4}
                                  />
                                </AvatarGroup>
                              </td>
                              <td>
                                <span
                                  className="px-2 py-1"
                                  style={{
                                    background:
                                      key.grievance_status == 0
                                        ? "#FAFFE5"
                                        : key.grievance_status == 1
                                        ? "#E5FFF2"
                                        : "#FFE5E5",
                                    color:
                                      key.grievance_status == 0
                                        ? "#C3BC16"
                                        : key.grievance_status == 1
                                        ? "#16C37A"
                                        : "#C31616",
                                    borderRadius: "8px",
                                  }}
                                >
                                  {key.grievance_status === 0
                                    ? "Pending"
                                    : key.grievance_status === 1
                                    ? "Closed"
                                    : "Rejected"}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex gap-2 align-items-center">
                                  <Tooltip title="Update Status">
                                    <ChangeCircleIcon
                                      color="primary"
                                      sx={{
                                        fontSize: "2rem",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        handleShow(key.id);
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="View Details">
                                    <MoreVertIcon
                                      color="primary"
                                      sx={{
                                        fontSize: "2rem",
                                        cursor: "pointer",
                                      }}
                                      onClick={()=>{handleShow1(key)}}
                                    />
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    )}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* update status modal started  */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="w-100 py-2 px-2"
            style={{ borderRadius: "10px" }}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option hidden selected>
              --pls select status--
            </option>
            <option value="1">Complete</option>
            <option value="2">Reject</option>
          </select>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button
            className="w-100 btn btn-primary mt-2"
            disabled={status <= 0 ? true : false}
            onClick={() => {
              if (status == 2) {
                reject();
              } else if (status == 1) {
                close();
              }
            }}
          >
            Proceed
          </button>
        </Modal.Footer>
      </Modal>
      {/* update status modal ended  */}

      {/* view details modal started  */}
      <Offcanvas
        show={show1}
        onHide={handleClose1}
        placement="end"
        backdrop="static"
        style={{width:isMobileOrTablet?"100%":"35%"}}
      >
        <Offcanvas.Header closeButton style={{ borderBottom: "1px solid" }}>
          <Offcanvas.Title>Grievance</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            {
              selectedItem && (
                <>
                  <div>
                    <p className="mb-0" >Title : </p>
                    <h5>{selectedItem.grie_title}</h5>
                  </div>
                  <div>
                    <p className="mb-0" >Details : </p>
                    <h5>{selectedItem.grievance_details}</h5>
                  </div>
                  <div>
                    <p className="mb-0" >District : </p>
                    <h5>{selectedItem.districtName}</h5>
                  </div>
                  <div>
                    <p className="mb-0" >Block : </p>
                    <h5>{selectedItem.blockName}</h5>
                  </div>
                  <div>
                    <p className="mb-0" >Village : </p>
                    <h5>{selectedItem.villageName}</h5>
                  </div>
                  <div>
                    <p className="mb-0" >Address : </p>
                    <h5>{selectedItem.address_details}</h5>
                  </div>
                  <div>
                    <p className="mb-0" >Lattitude : </p>
                    <h5>{selectedItem.lat}</h5>
                  </div>
                  <div>
                    <p className="mb-0" >Longitude : </p>
                    <h5>{selectedItem.long}</h5>
                  </div>
                </>
              )
            }
        </Offcanvas.Body>
      </Offcanvas>
      {/* view details modal ended  */}
    </>
  );
};

export default Grievances;
