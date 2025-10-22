import { Avatar, Card, Col, Skeleton } from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'

const SkeltonCard = (props) => {

    const { count, avatar, loading, image } = props

    return (
        <>
            {[...Array(count ? count : 3)].map((_, index) => (
                <Col xs={24} sm={12} md={8} lg={12} xl={8} xxl={8} key={index}>
                    <Card style={{ minWidth: "260px" }} >
                        {image && <Skeleton.Image active />}
                        <Skeleton style={{ width: "100%" }} loading={loading} avatar={avatar} active>
                            <Meta
                                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
                                title="Card title"
                                description="This is the description"
                            />
                        </Skeleton>
                    </Card>
                </Col>
            ))}
        </>
    )
}

export default SkeltonCard