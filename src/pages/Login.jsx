import loginImg from "../assets/Images/coding-for-kids-complete-guide.png"
import Template from "../components/core/Auth/Template"

function Login() {
    return (
        <Template
            title="Welcome Back"
            description1 = "Build skills for today, tommrrow, and beyond"
            description12= "Education to future-proof your career"
            image={loginImg}
            formType="login"
        />
    )
}

export default Login