import React, { useEffect, useState } from 'react';
import "./Edit.css";
import AdminSidebar from './admin/AdminSideBar';
import {useParams} from "react-router-dom";
export default function Edit() {
    let id=useParams()
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        phone:"",
        role:""
    });
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


    return (
        <>
        <AdminSidebar/>
        <h2>Edit User Section</h2>
        <form onSubmit={handleSubmit} className="edit-form">
            <input type="text"name="name"  value={formData.name} placeholder="name" required onChange={handleChange}/>
            <input type="text"name="email" value={formData.email} placeholder="email" required onChange={handleChange}/>
            <input type="text"name="phone"value={formData.phone} onChange={handleChange} placeholder="phone" required/>
            <select required value={formData.role} name="role" onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="customer">customer</option>
                <option value="admin">admin</option>
            
            </select>
            <button type="submit">Update</button>
        </form>
        </>
    )
}


