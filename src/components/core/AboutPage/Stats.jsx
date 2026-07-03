import React from 'react'

const Stats = [
    {count: "5K",label: "Active Students"},
    {count: "10+",label: "Mentors"},
    {count: "200+",label:"Courses"},
    {count: "50+",label:"Awards"},
];

const StatsComponent = () => {
  return (
    <section className="bg-[#241A3E]">
        <div className="flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 text-center">
                {
                    Stats.map((data,index) => {
                        return (
                            <div className="flex flex-col px-20 py-20" key={index}>
                                <h1 className="text-[30px] font-bold text-richblack-5 leading-9">
                                    {data.count}
                                </h1>
                                <h2 className="font-semibold font-inter text-[16px] leading-6 text-richblack-500">
                                    {data.label}
                                </h2>
                            </div>
                        )
                    })  
                }
            </div>
        </div>
    </section>
  )
}

export default StatsComponent