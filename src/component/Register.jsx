import "./Register.css"
import { useState } from "react";
export default function Register() {
    const details={
        name:"",
        phone:"",
        email:"",
        password:"",
        confirmpassword:"",
        role:"" 
     }
    const [error,seterror]=useState({});
    const [data,setdata]=useState(details);
    function validate(name,value){
        let message="";
        switch(name){
            case "name":
                if(!value.trim()){
                    message="name is required"
                }
                else if (!/^[A-Za-z\s]+$/.test(value)){
                    message="name must contain only alphabets";
                }
                else if(value.length<3){
                    message="name must be atleast 3 character"
                }
                break;
            case "phone":
                if(!value.trim()){
                    message="phone number is required";
                }
                 else if (!/^\d{10}$/.test(value)){
                    message="phone number must be 10 digits";
                 }
               break;
            case "email":
                if(!value.trim()){
                    message="email is required";
                }
                else if (!/^\S+@\S+\.\S+$/.test(value)){
                    message="enter valid email address";
                }
                break;
            case "password":
                if(!value.trim()){
                    message="password is required"
                }
                else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value)) {
                    message="password must be 8 character 1 number 1 special char 1 uppercase"
                }


        }
        seterror((prev)=>({...prev,[name]:message}));
           
    }
  function handleinputchange(e){
    let {name,value}=e.target;
    setdata((prev)=>({...prev,[name]:value}))
    validate(name,value);
  }
  return (
    <div>   
    <div className="registerdiv">
       <h2>Register page</h2>
       <input type="text"name="name" placeholder="Name"className="input-field"onChange={(e)=>handleinputchange(e)} />
       <div>{error && <p>{error.name}</p>}</div>
       <input type="text"name="phone" placeholder="Phone Number"className="input-field" onChange={(e)=>handleinputchange(e)} />
       <div>
        {error&&<p>{error.phone}</p>}
       </div>
       <input type="email"name="email" placeholder="Email" className="input-field"onChange={(e)=>handleinputchange(e)}/>
       <div>{error &&<p>{error.email}</p> }</div>
       <input type="password"name="password" placeholder="Password" className="input-field"onChange={(e)=>handleinputchange(e)} />
       <div>{error && <p>{error.password}</p>}</div>
       <input type="password"name="confrimpassword" placeholder="Confirm Password" className="input-field"/>
       <div></div>
       <select className="input-field"name="role">
        <option value="" >Select Role</option>
        <option value="Customer">Customer</option>
        <option value="admin">Admin</option>
       </select>
       <div></div>
       <button className="btn">Register</button>
    </div>
    </div>
  )
}