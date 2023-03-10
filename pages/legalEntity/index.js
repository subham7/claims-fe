import React from 'react'
import Layout2 from '../../src/components/layouts/layout2'
import Sidebar from '../../src/components/sidebar'

const index = () => {
  return (
    <>
        <Layout2>
            <Sidebar/>
            <h2 style={{color: 'white', fontSize: '50px'}}>Hello</h2>
        </Layout2>
    </>
  )
}

export default index