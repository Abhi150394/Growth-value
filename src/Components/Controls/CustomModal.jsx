import { Modal } from 'antd'
import React from 'react'

const CustomModal = (props) => {

    const { title, content, open, handleOk, handleCancel } = props

    return (
        <Modal title={title} open={open} onOk={handleOk} onCancel={handleCancel} {...props}>
            {content}
        </Modal>
    )
}

export default CustomModal