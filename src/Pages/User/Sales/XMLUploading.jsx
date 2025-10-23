import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const XMLUploader = ({ token }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const props = {
    beforeUpload: (file) => {
      const isXML = file.type === "text/xml" || file.name.endsWith(".xml");
      if (!isXML) {
        message.error("You can only upload XML files!");
        return Upload.LIST_IGNORE;
      }
      setFile(file);
      return false; // prevent auto upload
    },
    onRemove: () => setFile(null),
  };

  const handleUpload = async () => {
    if (!file) {
      message.warning("Please select an XML file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/upload-xml/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token?.access}`,
          },
        }
      );

      message.success("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        message.error("Authentication failed. Please log in again.");
      } else {
        message.error("Upload failed!");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <Upload {...props} maxCount={1}>
        <Button icon={<UploadOutlined />}>Select XML File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={!file}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default XMLUploader;
