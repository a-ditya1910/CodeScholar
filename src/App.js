import "./App.css";
import { Route, Routes } from "react-router-dom";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Navbar from "./components/common/Navbar"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import  { ACCOUNT_TYPE } from "./utils/constants"
import { useSelector } from "react-redux";
import MyCourses from "./components/core/Dashboard/MyCourses"
import AddCourse from "./components/core/Dashboard/AddCourse";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse"
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import ChatBot from "./components/common/ChatBot";
import LiveClasses from "./components/core/Dashboard/LiveClasses";
import LiveClassRoom from "./pages/LiveClassRoom";

function App() {
  const { user } = useSelector((state) => state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <ChatBot/>
      <Routes>
        <Route path="/" element= {<Home/>}/>

        <Route path="catalog/:catalogName" element={<Catalog/>} />

        <Route path="courses/:courseId" element={<CourseDetails />} />

        <Route path="signup"element={<OpenRoute>  <Signup /> </OpenRoute>}/>

        <Route path="verify-email"element={<OpenRoute>  <VerifyEmail /> </OpenRoute>}/>

        <Route path="login" element={<OpenRoute><Login/></OpenRoute>}/>

        <Route path="forgot-password" element={<OpenRoute><ForgotPassword/></OpenRoute>}/>

        <Route path="update-password/:id" element={<OpenRoute><UpdatePassword/></OpenRoute>}/>

        <Route path="about" element={<OpenRoute> <About /> </OpenRoute>}/>

        <Route path="contact" element={<OpenRoute> <Contact /> </OpenRoute>}/>

        <Route 
          element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }>
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />
          <Route path="dashboard/live-classes" element={<LiveClasses />} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>} /> 
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />}/>
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
              </>
            )
          }
        </Route>

        <Route element={
          <PrivateRoute>
            <ViewCourse />
          </PrivateRoute>
        }>
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route 
                  path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                  element={<VideoDetails />}
                />
              </>
            )
          }

        </Route>

        <Route
          path="live-class/:classId"
          element={
            <PrivateRoute>
              <LiveClassRoom />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Error/>} />
      </Routes>
    </div>
  );
}

export default App;
