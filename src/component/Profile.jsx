import "./Profile.css";
import {useState,useEffect} from "react";
import AdminSidebar from "./admin/AdminSideBar";
import {useNavigate} from "react-router-dom";
import { Global } from "../component/Global";
export default function Profile() {
    const [data,setdata]=useState([]);
    const [popup,setpopup]=useState(false);
    const nav=useNavigate();
    useEffect(()=>{
        const fetchProfile=async()=>{
            
                const response=await fetch("http://localhost:4000/profile",{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json"
                
                    }, 
                    credentials:"include"
                });
                const result=await response.json();
                setdata(result);  
            
                
        }
        fetchProfile();

    },[]);
   const deleteAccount=async(id)=>{

    try{
        const response=await fetch(`http://localhost:4000/delete-profile/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        });
        const result=await response.json();
        if(response.ok){
          setpopup(true);
            
        
        
        }
    }catch(err){
        
        console.log("Delete error:",err);
    }

   }
   
    return (
        <>
        <AdminSidebar/>
        <h2>Profile Section</h2>
        {data.map((user)=>(
            <div className="profile" key={user._id}>
           
            <div className="profile-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <button className="edit" onClick={()=> nav(`edit/${user._id}`)}>Edit</button>
                <button className="delete" onClick={()=>deleteAccount(user._id)}>Delete</button>
            </div>
        </div>
        ))}
        {popup&& (
            <div className="popup">
            <div className="popup-content">
                {console.log("Popup shown")}
                <h3>Account Deletion</h3>
                <p>Your account has been deleted. </p>
                <button className="popupbtn" onClick={() => setpopup(false)}>Close</button>
            </div>
        </div>
        )}

        </>
    )
}