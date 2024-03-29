import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Navebar from "../../../components/Admin/Navebar/Navebar";
import { axiosAdminInstance } from "../../../instance/axios";
import { showSuccessMsg } from "../../Utils/Notifications/Notification";
import axios from "axios";
function AddVehicle() {
  const [brands, setbrands] = useState([]);
  const vehicletype = [
    {
      type: "SUV",
    },
    {
      type: "Hatchback",
    },
    {
      type: "Sedan",
    },
    {
      type: "Micro Suv",
    },
    {
      type: "MPV",
    },
    {
      type:"Offroader"
    }
  ];

  useEffect(() => {
    async function getbrands() {
      try {
        const brand = await axiosAdminInstance.get("/brands");
        setbrands(brand.data.brands);
      } catch (error) {
        console.log(error);
      }
    }
    getbrands();
  }, []);

  const { TextArea } = Input;

  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [success, setsuccess] = useState(false);

  const handleChange = ({ fileList }) => setImages(fileList);
  const [selectedFile, setSelectedFile] = useState(null);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  async function submit() {
    const values = form.getFieldsValue();
    console.log(values);
 
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "cbepzz3d");

    console.log(formData);

    const up = await axios.post(
      "https://api.cloudinary.com/v1_1/doelennei/image/upload/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log(up);
    const imagedata = up.data.url;

    const res = await axiosAdminInstance.post("/addvehicle", { values,imagedata });
    console.log(res);
    if (res) {
      form.resetFields();
      setsuccess(true);
      setTimeout(() => {
        setsuccess(false)
      }, 5000);
    }
  }

  return (
    <div>
      <Navebar />
      <div className="mt-48 ">
        <>
        <div className="w-48">
          {success == true && showSuccessMsg("successfully Added vehicle")}
          </div>
          <Form
            form={form}
            onFinish={submit}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            // onValuesChange={onFormLayoutChange}
          >
            <Form.Item name="Name" label="name">
              <TextArea placeholder="Name" cols={70} />
            </Form.Item>
            <Form.Item name="Brand" label="Brand">
              <Select
                placeholder="brand"
                cols={70}
                style={{ width: 500 }}
                options={brands.map((brand) => ({ value: brand.Brandname }))}
              ></Select>
            </Form.Item>
            <Form.Item name="Type" label="Type">
              <Select
                placeholder="Vehicle Type"
                cols={70}
                style={{ width: 500 }}
                options={vehicletype.map((vehicle) => ({
                  value: vehicle.type,
                }))}
              ></Select>
            </Form.Item>
            <Form.Item name="Engine" label="Engine">
              <TextArea placeholder="Engine" cols={70} />
            </Form.Item>
            <Form.Item name="Power" label="Power">
              <TextArea placeholder="Power" cols={70} />
            </Form.Item>
            <Form.Item name="price" label="price">
              <TextArea placeholder="price" cols={70} />
            </Form.Item>
            <Form.Item name="Torque" label="Torque">
              <TextArea placeholder="Torque" cols={70} />
            </Form.Item>
            <Form.Item name="Fueltype" label="Fueltype">
              <TextArea placeholder="Fuel type" cols={70} />
            </Form.Item>
            <Form.Item name="Seats" label="Seats">
              <TextArea placeholder="Seats" cols={70} />
            </Form.Item>
            <Form.Item name="Mileage" label="Mileage">
              <TextArea placeholder="Mileage" cols={70} />
            </Form.Item>
            <Form.Item name="Cylinders" label="Cylinders">
              <TextArea placeholder="Cylinders" cols={70} />
            </Form.Item>
            <Form.Item name="video" label="Video">
              <TextArea placeholder="Video Link" cols={70} />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea placeholder="description " cols={70} rows={5} />
            </Form.Item>

            <Form.Item name="image" label="">
            <input type="file" onChange={onFileChange} />
            <button></button>
            </Form.Item>
            <Form.Item label="">
              <Button htmlType="submit" className="bg-red-600">
                Add Vehicle
              </Button>
            </Form.Item>
          </Form>
        </>
      </div>
    </div>
  );
}

export default AddVehicle;
 