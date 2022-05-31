import React from 'react'

function Tag({ name }: { name: string }) {
    return (
        <div className='bg-gray px-2 py-1 rounded-2xl text-white text-xs'>
            {name}
        </div>
    )
}

export default Tag