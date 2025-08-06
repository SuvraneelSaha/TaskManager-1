import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="h-screen overflow-hidden flex flex-col md:flex-row">
      {/* Left Side - Dark Background */}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-10 bg-[#1f1f1f] text-white">
        <div className="mb-10">
          <div className="flex items-center space-x-3">
            <i class="fa-solid fa-pen-nib text-3xl text-[#81E6D9]"></i>
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
              className="block w-full text-center bg-[#3182CE] text-white py-3 rounded-lg hover:bg-[#2B6CB0] transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block w-full text-center bg-white text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition"
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

      {/* Right Side - Image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1570649236495-42fa5fe5c48b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login visual"
          className="object-cover object-left w-full h-screen"
        />
      </div>
    </section>
  );
}

export default Home;
