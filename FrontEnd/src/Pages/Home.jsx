import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

function Home() {
  const loginRef = useRef(null);
  const registerRef = useRef(null);

  useEffect(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const createTextEffect = (element) => {
      let interval = null;

      const handleMouseOver = (event) => {
        let iteration = 0;
        const originalText = event.target.dataset.value;

        clearInterval(interval);

        interval = setInterval(() => {
          event.target.innerText = originalText
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return originalText[index];
              }
              return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

          if (iteration >= originalText.length) {
            clearInterval(interval);
          }

          iteration += 1 / 3;
        }, 30);
      };

      element.addEventListener("mouseover", handleMouseOver);

      // Cleanup function
      return () => {
        element.removeEventListener("mouseover", handleMouseOver);
        clearInterval(interval);
      };
    };

    const cleanupLogin = loginRef.current
      ? createTextEffect(loginRef.current)
      : null;
    const cleanupRegister = registerRef.current
      ? createTextEffect(registerRef.current)
      : null;

    return () => {
      if (cleanupLogin) cleanupLogin();
      if (cleanupRegister) cleanupRegister();
    };
  }, []);

  return (
    <section className="h-screen overflow-hidden flex flex-col md:flex-row">
      {/* Left Side*/}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-10 bg-[#1f1f1f] text-white">
        <div className="mb-10">
          <div className="flex items-center space-x-3">
            <i className="fa-solid fa-pen-nib text-3xl text-[#81E6D9]"></i>
            <span className="text-3xl font-bold">TaskTracker</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h3 className="text-2xl font-semibold mb-6 tracking-wide">
            Welcome to TaskTracker
          </h3>

          <div className="space-y-4">
            <Link
              to="/login"
              ref={loginRef}
              data-value="Login"
              className="block w-full text-center bg-[#500db2] text-white py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 font-mono tracking-wider border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.8),inset_0_0_20px_rgba(34,211,238,0.1)]"
            >
              Login
            </Link>
            <Link
              to="/register"
              ref={registerRef}
              data-value="Register"
              className="block w-full text-center bg-[#BF00FF] text-white py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 font-mono tracking-wider border-2 border-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.5)] hover:shadow-[0_0_20px_rgba(20,184,166,0.8),inset_0_0_20px_rgba(20,184,166,0.1)]"
            >
              Register
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            Forgot password?{" "}
            <Link to="/" className="text-teal-300 hover:underline">
              Click here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1556441888-498b9c6bd63d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login visual"
          className="object-cover object-left w-full h-screen"
        />
      </div>
    </section>
  );
}

export default Home;
