/**
* @file  layout
* @date 2025-05-18
*/


import MobileNavigation from '@/components/MobileNavigation';
import SideBar from '@/components/SideBar';
import React from 'react';
import Header from '@/components/Header';
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from "next/navigation";

const Layout = async({children}:{children:React.ReactNode}) => {
  const currentUser=await getCurrentUser();
  if (!currentUser) return redirect("/sign-in");
  return(
  <main className='flex h-screen'>
    <SideBar fullName={currentUser.fullName} avatar={currentUser.avator} email={currentUser.email}></SideBar>
    <section className='flex h-full flex-1 flex-col'>
        <MobileNavigation 
        fullName={currentUser.fullName} 
        avatar={currentUser.avator} 
        email={currentUser.email} 
        accountId={currentUser.accountId} 
        ownerId={currentUser.ownerId}
        ></MobileNavigation>
        <Header></Header>
        <div className='main-content'>{children}</div>
    </section>

  </main>
  )
}; 


export default Layout;
