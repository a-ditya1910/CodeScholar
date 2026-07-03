const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress")

exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;

    if (courses.length === 0) {
        return res.json({
            success: false,
            message: "Please provide Course Id",
        });
    }

    let totalAmount = 0;

    for (const course_id of courses) {  
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(200).json({
                    success: false,
                    message: "Could not find the course",
                });
            }

            // Log the course object for debugging
            console.log('Course:', course);

            // Ensure studentEnrolled is an array
            if (!Array.isArray(course.studentEnrolled)) {
                course.studentEnrolled = [];
            }

            // Check for enrollment
            if (course.studentEnrolled.includes(userId)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled",
                });
            }

            totalAmount += course.price;
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };
    
    try {
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            message: paymentResponse,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate Order",
        });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(200).json({
            success: false,
            message: "Payment Failed",
        });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        await enrollStudent(courses, userId, res);
        return res.status(200).json({
            success: true,
            message: "Payment Verified",
        });
    }

    return res.status(200).json({
        success: false,
        message: "Payment Failed",
    });
};

const enrollStudent = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please Provide data for Courses or UserId",
        });
    }

    for (const courseId of courses) {
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentEnrolled: userId } }, // Corrected to studentEnrolled
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not Found",
                });
            }

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })

            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                { $push: { courses: courseId } },
                { new: true }
            );

            // enrollment email is non-critical - don't let it break the payment
            try {
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
                );
                console.log("Email Sent Successfully", emailResponse?.response);
            } catch (emailError) {
                console.log("Enrollment email failed (non-fatal):", emailError.message);
            }
        } catch (error) {
            console.log(error); // Correctly log the error
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the fields",
        });
    }

    try {
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName}`,
                amount / 100,
                orderId,
                paymentId
            )
        );
    } catch (error) {
        console.log("Error in sending mail", error);
        return res.status(500).json({
            success: false,
            message: "Could not send email",
        });
    }
};


// exports.capturePayment = async(req,res) => {

//     const {course_id} = req.body;
//     const userId = req.user.id;

//     if(!course_id){
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };

//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             })
//         }

//         // check
//         const uid  = mongoose.Types.ObjectId(userId);
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
        
//     }
//     catch(error){
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }

//     const amount = course.price;
//     const currency = "INR";


//     const options = {
//         amount : amount *100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         return res.status(200).json({
//             success:true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         })
//     }
//     catch(error){
//         console.log(error);
//         res.json({
//             success:false,
//             message:'Could not initiate order',
//         })
//     }

// }


// exports.verifySignature = async(req,res) => {
//     const webhookSecret = "12345678";

//     const signature = req.header["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256",webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("Payment is Authorized");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{

//             const enrolledCourse = await Course.findOneAndUpdate(
//                                             {_id: courseId},
//                                             {$push: {studentEnrolled: userId}},
//                                             {new:true},
//             );

//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success:false,
//                     message:'Course not Found',
//                 });
//             }

//             console.log(enrolledCourse);

//             const enrolledStudent = await User.findOneAndUpdate(
//                                             {_id:userId},
//                                             {$push:{course:courseId}},
//                                             {new:true},
//             );

//             console.log(enrolledStudent);

//             // mail send
//             const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congrulation, you are onboard into new Course",
//                                         // need to done
//                                         "Congrulation, you are onboard into new Course"
//             );

//             console.log(emailResponse);
            
//             return res.status(200).json({
//                 success:false,
//                 message:"Signature Verified and Course Added",
//             })
//         }
//         catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else{
//         return res.status(404).json({
//             success:false,
//             message:'Could not find the course',
//         });
//     }
// }