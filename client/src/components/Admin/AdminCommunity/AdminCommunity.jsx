import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Radio, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { axiosAdminInstance } from "../../../instance/axios";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Select as MatSelect } from '@material-ui/core';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
 const platforms = [
    {
      platform: "Whatsapp",
    },
    {
      platform: "Facebook",
    },
    {
      platform: "Telegram",
    },
    {
      platform: "Instagram",
    },
    {
      platform: "Discord",
    },
    {
      platform: "Other",
    },
  ];

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();

 
  return (
    <Modal
      open={open}
      title="Add New Community"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please Enter the Name of Community",
            },
          ]}
        >
          <Input style={{ width: 300 }} placeholder="Community name" />
        </Form.Item>
        <Form.Item
          name="link"
          rules={[
            {
              required: true,
              message: "Please Provide a link of community",
            },
          ]}
        >
          <Input style={{ width: 300 }} placeholder="Link" type="textarea" />
        </Form.Item>
        <Form.Item name="platform">
          <Select
            style={{ width: 300 }}
            options={platforms.map((platform) => ({
              value: platform.platform,
            }))}
            placeholder="Platform"
            type="textarea"
          />
        </Form.Item>
        <Form.Item name="description">
          <TextArea placeholder="Description " cols={100} rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

function AdminCommunity() {
  const [open, setOpen] = useState(false);
  const [communities, setcommunity] = useState([]);
  useEffect(() => {
    async function getCommunity() {
      try {
        const comm = await axiosAdminInstance.get("/community");
        
        setcommunity(comm.data.community);
      } catch (error) {
        console.log(error);
      }
    }
    getCommunity();
  }, [deletecommunity]);

  const onCreate = async (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);

    const add = await axiosAdminInstance.post("/addCommunity", { values });
    console.log(add);
  };

  const classes = useStyles();
  const [filters, setFilters] = useState({
    name: "",
    platform: "",
    
  });

  async function deletecommunity(id){
    try {
      axiosAdminInstance.post('/deletecomm',{id})
    } catch (error) {
      
    }
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredCommunities = communities.filter((community) => {
    const nameMatch = community.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const typeMatch = community.platform
      .toLowerCase()
      .includes(filters.platform.toLowerCase());
  
    return nameMatch && typeMatch;
  });




  async function block(id){
    try {
      const res= await axiosAdminInstance.post('/blockcommunity',{id})
      console.log(res);
    } catch (error) {
     
    }
}
async function unblock(id){
 try {
   const res= await axiosAdminInstance.post('/unblockcommunity',{id})
   console.log(res);
 } catch (error) {
  
 }
}


  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedAction, setSelectedAction] = useState('');

  const handleBlock = (community) => {
    setSelectedUser(community);
    setSelectedAction('block');
    setVisible(true);
  }

  const handleUnblock = (user) => {
    setSelectedUser(user);
    setSelectedAction('unblock');
    setVisible(true);
  }

  const handleOk = async () => {
    setVisible(false);
    if (selectedAction === 'block') {
      await block(selectedUser._id);
    } else {
      await unblock(selectedUser._id);
    }
  }

  const handleCancel = () => {
    setVisible(false);
  }

  return (
    <div className="mt-32 ml-10">
      <div>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Add new Community
        </Button>
        <CollectionCreateForm
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </div>
      <div>
        <>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="car table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TextField
                      label="Name"
                      name="name"
                      value={filters.name}
                      onChange={handleFilterChange}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="platform"
                      name="platform"
                      value={filters.platform}
                      onChange={handleFilterChange}
                    />


                   
                  </TableCell>
                 
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <Modal
        title={`Are you sure you want to ${selectedAction}  ${selectedUser.name} ?`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        
      </Modal>
              <TableBody>
                {filteredCommunities.map((community) => (
                  // console.log(car.Images, "this is car"),
                  <TableRow key={community.id}>
                    <TableCell component="th" scope="row">
                      {community.name}
                    </TableCell>
                    <TableCell>{community.platform}</TableCell>
                   
                    <TableCell>
                    <IconButton
                      color={community.blocked === true ? "secondary" : "primary"}
                      onClick={() => {
                        // Implement block/unblock logic here
                      }}
                    >
                      {community.blocked === true ? (
                        <BlockIcon
                          onClick={() => {
                            handleUnblock(community)
                          }}
                        />
                      ) : (
                        <CheckIcon
                          onClick={() => {
                            handleBlock(community);
                          }}
                        />
                      )}
                    </IconButton>

                      
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      </div>
    </div>
  );
}

export default AdminCommunity;
