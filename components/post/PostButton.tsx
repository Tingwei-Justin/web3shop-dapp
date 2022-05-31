import React from 'react'
import { PlusSmIcon as PlusSmIconSolid } from '@heroicons/react/solid'
import { useUI } from '@components/ui';

function PostButton() {
    const {
        setModalView,
        openModal,
    } = useUI()

    return (
        <button
            className="flex-1 inline-flex ring-1 items-center px-4 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-2xl text-white bg-black hover:scale-105"
            onClick={() => {
                setModalView("POST_VIEW");
                openModal();
            }}
        >
            Post
            <PlusSmIconSolid className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>
    )
}

export default PostButton