/**
* @file  layout
* @date 2025-05-18
*/


import React from 'react';

const Layout = ({children}:{children:React.ReactNode}) => {
  return(
  <main className='flex h-screen'>
    sidebar
    <section className='flex h-full flex-1 flex-col'>
        MobileNavigation Header
        <div className='main-content'>{children}</div>
    </section>

  </main>
  )
}; 


export default Layout;
