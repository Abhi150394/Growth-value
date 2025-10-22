import React, { useEffect, useState } from "react";
import "../../Assests/Styles/userManagement.css";
import { Popconfirm, Table } from "antd";
import { PiPencilSimpleDuotone } from "react-icons/pi";
import { TiDelete } from "react-icons/ti";
import { deleteUser, userDetails, usersList } from "../../API/user";
import EditUserModal from "../../Components/Common/editUserModal/editUserModal";
import TranslatedText from "../../Components/Controls/TranslatedText"; // Import TranslatedText

const UserManagement = ({ userToken }) => {
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState();
  const [data, setData] = useState([]);

  const paginationConfig = {
    position: ["bottomCenter"],
    pageSize: 100,
  };

  const handleEdit = async (e) => {
    const res = await userDetails(userToken, e);
    if (res?.status === 200) {
      setEditUser(res?.data);
      setOpen(true);
    }
  };

  const handleDel = async (id) => {
    const res = await deleteUser(userToken, id);
    if (res?.status === 200) setData(data?.filter((item) => item?.id !== id));
  };

  const columns = [
    {
      title: <TranslatedText>Name</TranslatedText>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <TranslatedText>Email</TranslatedText>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <TranslatedText>Contact No</TranslatedText>,
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: <TranslatedText>Action</TranslatedText>,
      dataIndex: "action",
      key: "action",
      className: "action-col",
      render: (a, b) => {
        return (
          <div className="action">
            <span className="edit-btn" onClick={() => handleEdit(b?.id)}>
              <PiPencilSimpleDuotone />
            </span>
            <span> </span>
            <Popconfirm
              title={<TranslatedText>Are you sure you want to remove this user?</TranslatedText>}
              onConfirm={() => handleDel(b?.id)}
              okText={<TranslatedText>Yes</TranslatedText>}
              cancelText={<TranslatedText>No</TranslatedText>}
              placement="topRight"
              style={{ maxWidth: "100px" }}
            >
              <span className="del-btn">
                <TiDelete />
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const func = async () => {
      const res = await usersList(userToken);
      if (res?.status === 200) {
        setData(res?.data);
      }
    };
    func();
  }, [userToken]);

  return (
    <div className="user-management">
      <div className="table">
        <Table
          columns={columns}
          dataSource={data}
          pagination={paginationConfig}
          loading={false}
          rowKey={(record) => record.key}
          bordered
          scroll={{ x: 800 }}
          sticky
        />
      </div>
      {open && (
        <EditUserModal
          open={open}
          setOpen={setOpen}
          userToken={userToken}
          user={editUser}
          data={data}
          setData={setData}
        />
      )}
    </div>
  );
};

export default UserManagement;
