import React from 'react'
import {FaArrowRight} from "react-icons/fa"
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from "../components/core/HomePage/Button"
import HumanCoding from "../assets/Images/humancodingimage.avif"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from "../components/common/Footer"
import ReviewSlider from '../components/common/ReviewSlider'


const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center
         text-white justify-between gap-8'>

            <Link to={"/signup"}>
 
                <div data-aos="zoom-in" className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                transition-all duration-200 hover:scale-95 w-fit 
                box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.18) inset; hover:drop-shadow-none'>
                    <div className='flex flex-row items-center gap-[10px] rounded-full 
                    px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight/> 
                    </div>
                </div>
            </Link>

            <div className='text-center text-4xl font-semibold '>
                Learn, Build, and Grow with
                <HighlightText text={"CodeScholar"}/>
            </div>

            <div className='w-[68%] text-center font-bold text-richblack-300 text-base mx-auto'>
                CodeScholar brings expert-led courses, hands-on projects, and AI-powered practice together in one place, so you learn at your own pace and actually keep what you build.
            </div>

            <div className='flex flex-row gap-7'>
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>

                <CTAButton active={false} linkto={"/login"}>
                    Explore Courses
                </CTAButton>
            </div>

            <div className='shadow-blue-200 mx-3 my-7 shadow-[10px_-5px_50px_-5px]'>
                <img
                    src={HumanCoding}
                    alt="Coding"
                    className='rounded-md shadow-[20px_20px_rgba(255,255,255)]'
                />
            </div>

            {/* Code Section 1 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row flex-col"}
                    heading={
                        <div className='text-4xl font-semibold'>
                            Grow your
                            <HighlightText text={"coding potential "}/>
                            with project-based lessons
                        </div>
                    }
                    subheading={
                        "Every course is built and taught by working engineers, so you pick up the practical, up-to-date skills that real teams use daily."
                    }
                    ctabtn1={
                        {
                            btnText:"try it yourself",
                            linkto:"/signup",
                            active:true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn more",
                            linkto:"/login",
                            active:false,
                        }
                    }

                    codeblock={`<!DOCTYPE html>
                        <html>
                        head><title>Example</
                        title><linkrel="stylesheet"href="styles.css">
                        /head>
                        body>
                        h1><ahref="/">Header</a>
                        /h1>
                        nav><ahref="one/">One</a><ahref="two/">Two</
                        a><ahref="three/">Three</a>
                        /nav>`}     

                    codeColor={"text-yellow-25"}  

                    backgroudGradient={<div className="codeblock1 absolute"></div>}
                />
            </div>

            {/* code Section 2 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row-reverse flex-col"}
                    heading={
                        <div className='text-4xl font-semibold lg:w-[50%]'>
                            Start <HighlightText text={"coding"}/>
                            <br/>
                            <HighlightText text={"in seconds "}/>
                        </div>
                    }
                    subheading={
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }
                    ctabtn1={
                        {
                            btnText:"Continue Lesson",
                            linkto:"/signup",
                            active:true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn more",
                            linkto:"/login",
                            active:false,
                        }
                    }

                    codeblock={`<!DOCTYPE html>
                        <html>
                        head><title>Example</
                        title><linkrel="stylesheet"href="styles.css">
                        /head>
                        body>
                        h1><ahref="/">Header</a>
                        /h1>
                        nav><ahref="one/">One</a><ahref="two/">Two</
                        a><ahref="three/">Three</a>
                        /nav>`}

                    codeColor={"text-blue-25"}  
                    backgroudGradient={<div className="codeblock2 absolute"></div>}
                />
            </div>
        </div>


        {/* Section 2 */}
        <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='homepage_bg h-[310px]'>

                <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                    
                    {/* view it */}
                    <div className='lg:h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white lg:mt-8'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-3'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/signup"}>
                            <div>
                                Learn More  
                            </div>
                        </CTAButton>
                    </div>

                </div>

            </div>


            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between
            gap-7'>

                <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                    <div className='text-4xl font-semibold lg:w-[45%]'>
                        Gain the skills that get you
                        <HighlightText text={"hired faster"} />
                    </div>

                    <div className='flex flex-col gap-10 lg:w-[40%] items-start '>
                        <div className='text-[16px]'>
                            The tech world moves fast. CodeScholar focuses on practical, job-ready skills over pure theory, so you stay a step ahead of the curve.
                        </div>

                        <CTAButton active={true} linkto={"/signup"}>
                            <div>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>

                <TimelineSection />

                <LearningLanguageSection />
            </div>
        </div>

        {/* Section 3 */}

        <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
            <InstructorSection />

            <h2 className='text-center text-4xl font-semibold mt-10'>What our learners say</h2>

            <ReviewSlider />
        </div>

        {/* Footer */}
        <Footer />
    </div>
  )
}

export default Home