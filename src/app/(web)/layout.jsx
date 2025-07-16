import Navbar from "@/components/Web/Navbar";
import Footer from "@/components/Web/Footer";
import { Toaster } from "react-hot-toast";

function layout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      <Toaster
          reverseOrder={false}
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: { background: "#333", color: "#fff" }
          }}
        />
      <Footer />
    </div>
  );
}

export default layout;
