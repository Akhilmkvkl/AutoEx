import React from 'react'
import { Button, Result } from 'antd';

function Failed() {
  return (
    <div>
        <div>
        <Result
    status="warning"
    title="There are some problems with your operation."
    extra={
      <Button type="primary" key="console">
        Go Console
      </Button>
    }
  />
        </div>
    </div>
  )
}

export default Failed