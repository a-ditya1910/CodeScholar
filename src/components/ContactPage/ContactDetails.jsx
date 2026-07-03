import React from 'react'
import * as Icon1 from "react-icons/bi"
import * as Icon2 from "react-icons/hi2"
import * as Icon3 from "react-icons/io5"

const contactDetails = [
    {
      icon: "HiChatBubbleLeftRight",
      heading: "Chat with us",
      description: "Our friendly team is here to help.",
      details: "info@codescholar.com",
      linkType: "email"
    },
    {
      icon: "BiWorld",
      heading: "Visit us",
      description: "Come and say hello at our office HQ.",
      details:
        "Sweka park 1st Block, dwarka sector-3, delhi-110078",
        linkType: null
    },
    {
      icon: "IoCall",
      heading: "Call us",
      description: "Mon - Fri From 8am to 5pm",
      details: "+123 456 7869",
      linkType: "phone"
    },
]

const ContactDetails = () => {
  return (
    <div className='flex flex-col gap-6 p-[34px] rounded-xl bg-richblack-800 h-[500px] lg:p-6 '>
        {contactDetails.map((element,index) => {
            let Icon = Icon1[element.icon] || Icon2[element.icon] || Icon3[element.icon];
            let detailElement;

            if(element.linkType == 'email'){
                detailElement = (
                    <a href={'mailto:${element.details}'} className='font-semibold text-richblack-200'>
                        {element.details}
                    </a>
                )
            }
            else if(element.linkType == 'phone'){
                detailElement = (
                    <a href={'tel:${element.details}'} className='font-semibold text-richblack-200'>
                        {element.details}
                    </a>
                ) 
            }
            else{
                detailElement = <p className='font-semibold'>{element.details}</p>
            }

            return (
                <div
                  className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200"
                  key={index}
                >
                  <div className="flex flex-row items-center gap-3">
                    <Icon size={25} />
                    <h1 className="text-lg font-semibold text-richblack-5">
                      {element?.heading}
                    </h1>
                  </div>

                  <p className="font-medium">{element?.description}</p>

                  {detailElement}
                </div>
            )
        })}
    </div>
  )
}

export default ContactDetails