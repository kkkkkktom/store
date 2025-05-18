/**
* @file  Header
* @date 2025-05-18
*/


import React from 'react';
import {Button} from '@/components/ui/button'
import Image from 'next/image';

const Header = () => {
return (
    <header className='header'>
        Search
        <div className='header-wrapper'>
            FileUpLoader
            <form>
                <Button type='submit' className='sign-out-button'>
                    <Image
                    src='/assets/icons/logout.svg'
                    alt='logo'
                    width={24}
                    height={24}
                    className='w-6'
                    >
                    </Image>

                </Button>
            </form>
        </div>
    
    </header>
)
};


export default Header;
