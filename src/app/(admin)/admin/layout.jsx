import Sidebar from "@/components/Admin/Sidebar";
import Header from "@/components/Admin/Header";

export default function Layout({ children }) {
    return (
        
      <div>
        <Sidebar/> 
        <Header/>
        <div className=" ml-[65px] md:ml-[95px]">
        {children}
        </div>
      </div>
      
    );
  }
  