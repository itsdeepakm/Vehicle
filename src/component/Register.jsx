import "./Register.css"

export default function Register() {
  return (
    <div>   
    <div className="registerdiv">
       <h2>Register page</h2>
       <input type="text" placeholder="Name"className="input-field" />
       <div></div>
       <input type="text" placeholder="Phone Number"className="input-field" />
       <div></div>
       <input type="email" placeholder="Email" className="input-field"/>
       <div></div>
       <input type="password" placeholder="Password" className="input-field" />
       <div></div>
       <input type="password" placeholder="Confirm Password" className="input-field"/>
       <div></div>
       <button className="btn">Register</button>
    </div>
    </div>
  )
}