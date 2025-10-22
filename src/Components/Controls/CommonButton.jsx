import { Button, theme } from 'antd'
import { useMediaQuery } from 'react-responsive'

const CommonButton = (props) => {

    const { token } = theme.useToken()
    const { htmlType } = props

    const isDesktop = useMediaQuery({ minWidth: 768 })

    const button = {
        fontSize: "18px",
        fontWeight: 600,
        height: isDesktop ? "45px" : "36px",
        padding: isDesktop ? "8px 14px" : "6px",
        borderRadius: "50px",
        width: "100%",
    }

    return (
        <Button htmlType={htmlType} type={props.type} style={button} {...props}>{props.children}</Button>
    )
}

export default CommonButton