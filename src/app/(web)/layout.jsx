import Navbar from "@/components/Web/Navbar" 
import Footer from "@/components/Web/Footer"

function layout({children}) {
  return (
    <div>

    <Navbar/>
      {children}
    <Footer/>
    
    </div>
  )
}

export default layout
