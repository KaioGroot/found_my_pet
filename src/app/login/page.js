"use client"
import { auth } from "@/connection/firebase"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useRouter } from "next/navigation"


export default function Login() {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target;
    try {
      const session = await signInWithEmailAndPassword(auth, email.value, password.value);
      if (session.user) {
        console.log("User signed in successfully!");
        localStorage.setItem("user", JSON.stringify(session.user));
        router.push("/");
      } else {
        console.log("User sign-in failed:", error);
      }
      const user = auth.currentUser;
      if (user) {
        console.log("User Data:", {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        //enviar dados para o localStorage
      } else {
        console.log("No user is signed in.");
      }

      // Replace with your own logic
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      await signInWithPopup(auth, googleProvider);
      const user = auth.currentUser;
      if (user) {
        console.log("User signed in successfully with Google!");
        console.log(user)
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        console.log("User sign-in failed with Google:", error);
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div>
      <h1>Login Page</h1>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Login
            </button>
            <div className="mt-6 flex items-center justify-center">
              <a
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-purple-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-300"
              >
                <img src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png" alt="Google logo" className="w-6 h-6 mr-2" />
                Login with Google
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}