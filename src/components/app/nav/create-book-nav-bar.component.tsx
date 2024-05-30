import React from 'react'
import { IoChevronBack } from "react-icons/io5";
type Props = {}

export default function CreateBookNavBar({ }: Props) {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-none">
                <button className="btn border-0">
                    <IoChevronBack size={30} />
                </button>
            </div>
        </div>
    )
}