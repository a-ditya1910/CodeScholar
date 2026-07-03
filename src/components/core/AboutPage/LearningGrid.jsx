import React from 'react'
import HighlightText from "../HomePage/HighlightText"
import CTAButton from "../../core/HomePage/Button"

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "CodeScholar partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "CodeScholar partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "CodeScholar partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "CodeScholar partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "CodeScholar partners with more than 275+ leading universities and companies to bring",
  },
];


const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-full max-w-screen-xl grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-12 p-4">
      {
        LearningGridArray.map((card,index) => {
          return (
            <div
            key={index}
            className={`${index === 0 && "lg:col-span-2 lg:h-[280px] p-5"}
             ${
              card.order % 2 == 1 ? "bg-richblack-700 lg:h-[280px] p-5" : "bg-richblack-800 lg:h-[280px] p-5"
            }
            ${
              card.order === 3 && "lg:col-start-2"
            }
            ${
              card.order < 0 && "bg-transparent"
            }`}>
              {
                card.order < 0
                ? (<div className='lg:w-[90%] flex flex-col pb-5 gap-3'>
                  <div className="text-2xl sm:text-4xl font-semibold">
                    {card.heading}
                    <HighlightText text={card.highlightText}/>
                  </div>

                  <p className="text-richblack-300 font-medium text-sm sm:text-base">
                    {card.description}
                  </p>

                  <div className='w-fit mt-2'>
                    <CTAButton active={true} linkto={card.BtnLink}>
                      {card.BtnText}
                    </CTAButton>
                  </div>
                </div>) :
                (
                  <div className="p-3 flex flex-col gap-4 sm:gap-8">
                    <h1 className="text-richblack-5 text-lg sm:text-xl text-center font-bold">
                      {card.heading}
                    </h1>
                    <p className="text-richblack-100 font-medium text-sm sm:text-base px-2">
                      {card.description}
                    </p>
                  </div>
                )
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default LearningGrid