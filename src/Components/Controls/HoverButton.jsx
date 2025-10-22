import React from 'react'
import "../../../src/Assests/Styles/Button.css"
import { Button } from 'antd'

const HoverButton = (props) => {
    const { htmlType } = props

    return (
        <Button htmlType={htmlType} className="hover-button" type={props.type}  {...props}>{props.children}</Button>
    )
}

export default HoverButton