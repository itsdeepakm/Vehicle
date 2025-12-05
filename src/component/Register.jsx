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
    const [password,setpassword]=useState("");
    const [success,setsuccess]=useState(false);
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
                break;
            case "role":
                if(value.trim()===""||!value){
                    message="role is required"
                }
                break;
            case "confirmpassword":
                  if (!value.trim()) {
                  message = "confirm password is required";
                } else if (password !== value) {
                   message = "password did not match";
                }
                 break;

                


        }
        seterror((prev)=>({...prev,[name]:message}));
           
    }
  function handleinputchange(e){
    let {name,value}=e.target;
    if(name==="password"){
        setpassword(value);
    }
    setdata((prev)=>({...prev,[name]:value}))
    validate(name,value);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    
    const hasErrors = Object.values(error).some((msg) => msg && msg.length > 0);
    if (hasErrors) {
        alert("Please fix all errors before submitting");
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            if (result.errors) {
                seterror((prev) => ({
                    ...prev,
                    phone: result.errors.phone || "",
                    email: result.errors.email || "",
                }));
            }
            alert(result.message || "Registration failed");
            return;
        }

     
        setdata(details);
        setsuccess(true);
        setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    } catch (err) {
        alert("Server error: " + err.message);
    }
}

  const checkExists = async (field, value) => {
    if (!value.trim()) return;

    if (error[field]) return;

    try {
      const url =
        field === "phone"
          ? `http://localhost:4000/api/check-phone?phone=${value}`
          : `http://localhost:4000/api/check-email?email=${value}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.exists) {
        seterror((prev) => ({
          ...prev,
          [field]: field === "phone" ? "Phone already exists" : "Email already exists",
        }));
      }
    } catch (err) {
      console.log("Existence check error:", err);
      seterror((prev) => ({
        ...prev,
        general: "Server error",
      }));
    }
  };

  return (
    <div> 
   
    <form onSubmit={handleSubmit}>
    <div className="registerdiv">
       <h2>Register page</h2>
       <input type="text"name="name" placeholder="Name"className="input-field"onChange={(e)=>handleinputchange(e)} />
       <div>{error && <p>{error.name}</p>}</div>
       <input type="text"name="phone"onBlur={() => checkExists("phone", data.phone)}  placeholder="Phone Number"className="input-field" onChange={(e)=>handleinputchange(e)} />
       <div>
        {error&&<p>{error.phone}</p>}
       </div>
       <input type="email"name="email" onBlur={() => checkExists("email", data.email) } placeholder="Email" className="input-field"onChange={(e)=>handleinputchange(e)}/>
       <div>{error &&<p>{error.email}</p> }</div>
       <input type="password"name="password" placeholder="Password" className="input-field"onChange={(e)=>handleinputchange(e)} />
       <div>{error && <p>{error.password}</p>}</div>
       <input type="password"name="confirmpassword" placeholder="Confirm Password" className="input-field"onChange={(e)=>handleinputchange(e)}/>
       <div>{error &&<p>{error.confirmpassword}</p>}</div>
       <select className="input-field"name="role"onChange={(e)=>{handleinputchange(e)}}>
        <option value="" >Select Role</option>
        <option value="Customer">Customer</option>
        <option value="admin">Admin</option>
       </select>
       <div>{error && <p>{error.role}</p>}</div>
       <button type="submit" className="btn">Register</button>
    </div>
    </form>
    {success && (
  <div className="popup-overlay">
    <div className="popup-card">
      <h3>Registration Successful</h3>
      <p>Redirecting to login...</p>
    </div>
  </div>
)}

    </div>
  )
}