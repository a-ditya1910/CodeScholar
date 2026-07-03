import React from 'react'

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/teaching-code-class-stockcake.jpg"

const timeline = [
    {
        Logo: Logo1,
        heading: "Leardship",
        Description: "Fully committed to the success company",
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        Description: "Students will always be our top priority",
    },
    {
        Logo: Logo3,
        heading: "Flexibility",
        Description: "The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        heading: "Slove the problem",
        Description: "Code your way to a solution",
    },
    
];

const TimelineSection = () => {
  return (
    <div>
        <div className='flex flex-col lg:flex-row gap-15 items-center'>

            <div className='lg:w-[45%] flex flex-col gap-11 lg:gap-3'>
                {
                    timeline.map( (element, index) => {
                        return (
                            <div className='flex flex-row gap-6' key={index}>

                                <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                    <img src={element.Logo}/>
                                </div>  

                                <div>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                </div>    
                            </div>    
                        )
                    })
                }
            </div>

            <div className='relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]'>
                <img src={timelineImage} 
                alt='timelineImage'
                className='shadow-white shadow-[20px_20px_0px_0px] object-cover sm:h-[200px] md:h-[400px] lg:h-fit'/>

                <div className='absolute bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-7
                                lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%]
                                 gap-4 lg:gap-0 lg:py-10 '>
                    <div className='flex flex-row gap-5 items-center lg:border-r border-caribbeangreen-300 px-6 lg:px-14'>
                        <p className='text-3xl font-bold w-[75px]'>10</p>
                        <p className='text-caribbeangreen-300 text-sm w-[75px]'>Years of Experience</p>
                    </div>

                    <div className='flex gap-5 items-center px-7 lg:px-14'>
                        <p className='text-3xl font-bold w-[75px]'>250</p>
                        <p className='text-caribbeangreen-300 text-sm w-[75px]'>Types of Courses</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TimelineSection