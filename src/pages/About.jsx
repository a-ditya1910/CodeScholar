import React from 'react'
import HighlightText from "../components/core/HomePage/HighlightText"
import BannerImage1 from "../assets/Images/about.jpeg"
import BannerImage2 from "../assets/Images/about1.jpeg"
import BannerImage3 from "../assets/Images/about2.jpeg"
import Quote from '../components/core/AboutPage/Quote'
import FoundingStory from "../assets/Images/FoundingStory.png"
import StatsComponent from '../components/core/AboutPage/Stats'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import Footer from "../components/common/Footer"
import ReviewSlider from '../components/common/ReviewSlider'

const About = () => {
  return (
    <div>
        {/* section 1 */}
        <section className='bg-richblack-700'>
            <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white" >
                <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
                    Building the Next Generation of Developers with
                    <HighlightText text={"Real, Hands-On Skills"}/>
                    <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                    CodeScholar is where curious minds become confident developers. We blend project-based courses, mentorship from working engineers, and AI-powered practice to make learning to code genuinely stick.
                    </p>
                </header>

                <div className="sm:h-[70px] lg:h-[150px]"></div>

                <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
                    <img src={BannerImage1} alt="Learners collaborating" />
                    <img src={BannerImage2} alt="Student coding" />
                    <img src={BannerImage3} alt="Team working together" />
                </div>
            </div>
        </section>

        {/* section 2 */}
        <section className="border-b border-richblack-700">
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
            <div className="h-[100px] "></div>
            <Quote />
            </div>
        </section>

        {/* section 3 */}
        <section>
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
                {/* founding story */}
                <div className="flex flex-col items-center gap-5 lg:flex-row justify-between">
                    {/* founding Story left box */}
                    <div  className="my-24 flex lg:w-[50%] flex-col gap-10">
                        <h1 className="bg-gradient-to-br from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                            Our Founding Story
                        </h1>

                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            CodeScholar started with a simple frustration: plenty of people wanted to learn to code, but the resources were either shallow tutorials or walls of dense theory. A small group of engineers and educators came together to build something in between, a place where you actually learn by building real things.
                        </p>

                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            Having taught and mentored for years, we kept seeing the same gap: learners could follow along in a video, then freeze the moment they faced a blank editor. So we designed CodeScholar around practice, feedback, and projects, not passive watching, so the skills stay with you long after the lesson ends.
                        </p>

                    </div>

                    {/* founding story right box */}
                    <div>
                        <img
                            src={FoundingStory}
                            alt="Our founding story"
                            className="shadow-[0_0_25px_0] shadow-[#8B5CF6]"
                        />
                    </div>
                </div>

                {/* vision and mission */}
                <div className="flex flex-col items-center lg:gap-5 lg:flex-row justify-between">
                    {/* left box */}
                    <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                        <h1 className="bg-gradient-to-b from-[#A78BFA] to-[#5B21B6] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                            Our Vision
                        </h1>
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                        We imagine a world where anyone, anywhere can go from complete beginner to job-ready developer without a huge price tag or a four-year degree. To get there, we pair modern, industry-relevant content with tools that keep you engaged, accountable, and moving forward.
                        </p>
                    </div>


                    <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                        <h1 className="bg-gradient-to-b from-[#8B5CF6] via-[#6D28D9] to-[#4C1D95] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                            Our Mission
                        </h1>
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                        Our mission goes beyond shipping courses. We are building a community where learners help each other grow through discussion, live sessions, and shared projects. Skills compound fastest when people learn together in the open, and that belief shapes everything we make.
                        </p>
                    </div>
                </div>


            </div>
        </section>

        {/* section 4 */}
        <StatsComponent />

        {/* section 5 */}
        <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
            <LearningGrid />
            <ContactFormSection />
        </section>

        <section>
        <div className="relative mx-auto mt-20 flex  max-w-maxContent flex-col justify-between bg-richblack-900 text-white">
            <h1 className="text-center text-4xl font-semibold">
                What our learners say
            </h1>
            <ReviewSlider />
        </div>

        </section>

        <Footer />
    </div>
  )
}

export default About
