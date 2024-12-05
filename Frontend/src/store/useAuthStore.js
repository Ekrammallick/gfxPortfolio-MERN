import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore = create((set)=>({
    
    authUser:null,
  
    isLoggingIn:false,
   
    isCheckingAuth:true,
   

    checkAuth: async ()=>{
        try{
            const res = await axiosInstance.get("/auth/check");
           
                 set({authUser:res.data});
                
        } catch(error){
            console.log("Error in CheckAuth:",error)
        } finally{
            set(
                {isCheckingAuth:false}
            )
        }
    },
 

    login: async (data)=>{
       try{ set({isLoggingIn:true});
        const res = await axiosInstance.post("/auth/login",data)
       
        set({authUser:res.data})
        toast.success("Logged in successfully");
       
    } catch(error){
        const message = error.response?.data?.message || "An error occurred during login";
      toast.error(message);

     } finally{
        set({isLoggingIn:false})
    }
},

logout: async ()=>{
   
    try{
        await axiosInstance.post("/auth/logout");
        set({authUser:null});
        
        toast.success("Logged out successfully")
        
    } catch(error){
        const message = error.response?.data?.message || "An error occurred during logout";
        toast.error(message);
    }
},


   

   
}))