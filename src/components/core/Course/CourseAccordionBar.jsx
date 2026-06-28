import React, { useEffect, useState } from 'react'
import {AiOutlineDown} from "react-icons/ai"

export default function CourseAccordionBar({course,isActive,handleActive}) {
    const contentEl = useRef(null)

    const [active,setActive] = useState(false)
    useEffect(() => {
        setActive(isActive?.includes(course._id))
    },[isActive])

    const [sectionHeight,setSectionHeight] = useState(0)
    useEffect(() => {
        setSectionHeight(active ? contentEl.current.scrollHeight : 0)
    },[active])

  return (
    <div className='overflow-hidden border border-solid border-richblack-600 bg-richb00000000000000lack-700 text-richblue-5 last:mb-0'>
        <div>
            <div className={`flex cursor-pointer items-center justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]`}>
                
            </div>
        </div>
    </div>
  )
}
