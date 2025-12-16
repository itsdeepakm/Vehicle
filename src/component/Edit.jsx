import React, { useEffect, useState } from 'react';
import "./Edit.css";
import AdminSidebar from './admin/AdminSideBar';
import {useParams} from "react-router-dom";
export default function Edit() {
    const {id}=useParams();
    
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        phone:"",
        role:""
    });
    const [isEditingName,setIsEditingName]=useState(false);
    const [isEditingemail,setIsEditingEmail]=useState(false);
    

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
    }
    useEffect(()=>{
        const fetchUserData=async()=>{
            try{
                const response=await fetch(`http://localhost:4000/user/${id}`,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    credentials:"include"
                });
                const result=await response.json();
                if(response.ok){
                    setFormData(result);
                }
            }catch(err){
                console.log("Error fetching user data:",err);
            }
        }
        fetchUserData();
    },[id]);   
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await fetch(`http://localhost:4000/update-profile/${id}`,{
                method:"PUT",
                headers:{   
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(formData)
            });
            const result=await response.json();
            if(response.ok){
                console.log("User updated successfully:",result);
            }
        }catch(err){
            console.log("Error updating user:",err);
        }       
    }  
    const updatename=async()=>{
    
        try{
            const response=await fetch(`http://localhost:4000/update-name/${id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({name:formData.name})
            });
            const result=await response.json();
            if(response.ok){
                console.log("Name updated successfully:",result);
                setIsEditingName(false);
            }
        }catch(err){
            console.log("Error updating name:",err);
        }
    }
   const updateemail=async()=>{
        try{
            const response=await fetch(`http://localhost:4000/update-email/${id}`,{
                method:"PUT",
                headers:{   
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({email:formData.email})
            });
            const result=await response.json();
            if(response.ok){
                console.log("Email updated successfully:",result);
                setIsEditingEmail(false);
            }
        }catch(err){
            console.log("Error updating email:",err);
        }
    }
    return (
        <>
        <AdminSidebar/>
        <h2>Edit User Section</h2>
        <form onSubmit={handleSubmit} className="edit-form">
            <div className='name-div'>
            <input disabled={!isEditingName} type="text"name="name"className="input-field"  value={formData.name} placeholder="name" required onChange={handleChange}/>
            <button className='name-btn'onClick={()=>{
                if(isEditingName){
                    updatename();
                }else{
                    setIsEditingName(true);
                }
            }} >{isEditingName?"save":"Edit"}</button>
            </div>
            <div></div>
            <div className='name-div'>
            <input type="text"name="email" className="input-field" value={formData.email} placeholder="email" required onChange={handleChange}/>
            <button className='name-btn' 
            disabled={!isEditingemail}
            onClick={()=>{
                if(isEditingemail){
                    updateemail();
                }else{
                    setIsEditingEmail(true);
                }
            }}
            >{isEditingemail?"save":"Edit"}</button>
            </div>
            <div></div>
            <input type="text"name="phone"className='input-field' value={formData.phone} onChange={handleChange} placeholder="phone" required/>
            <div></div>
            <select required value={formData.role} className='input-field' name="role" onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="customer">customer</option>
                <option value="admin">admin</option>
            
            </select>
            <div></div>
            <button className="btn"  type="submit">Update</button>
        </form>
        </>
    )
}


