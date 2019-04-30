import React, {Component} from 'react';
import '../App.css';
import database from '../Config/firebase_config.js';
import firebase from 'firebase';
export default class Admin extends Component{

    constructor(props){
        super(props);
        this.state = {
            goFlag : false
        };
    }

    GoHandler = () =>{
        if(this.refs.key.value === 'Happy')
        this.setState({goFlag:true});
    }

    submitHandler = (e) =>{
        const mrms = this.refs.mrms.value;
        const name = this.refs.name.value;
        const desg = this.refs.desg.value;
        const bloodgroup = this.refs.bloodgroup.value;
        const email = this.refs.regemail.value;
        const password = this.refs.regpassword.value;
        const subspec = this.refs.subspec.value;
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email,password);
        promise
            .then(

                result => {
                    console.log(result.user);
                    console.log(result.user.email);     
                    database.ref('Faculty/'+result.user.uid).set({
                            Name : mrms+' '+name,
                            Desg : desg,
                            BloodGroup : bloodgroup,
                            EmailId : email,
                            SubjectSpecification : subspec
                         });
                    this.setState({goFlag:false});
                }
            );
        promise
            .catch( e =>{
                console.log('catch-->'+e.message);
                alert(e.message);
                this.setState({goFlag:true});                
            });
    }

    render(){
        var display;
        if(this.state.goFlag === false){
                display = <div>
                            <br/> <br/> <br/>               
                            <h5> Admin</h5>
                            <input type="text" placeholder="Enter the Secret Key" ref="key"/>
                            <br/>
                            <button onClick={this.GoHandler}>Go</button>
                        </div>
        }
        else {
            display =  <div>
                            <br/> <br/> <br/>
                            <h5> Registration Form </h5>
                            <label> Name : </label>
                            <input type="text" ref="mrms" size="2" placeholder="Mr/Ms"/>
                            {' '}
                            <input type="text" ref="name" placeholder="Enter Name"/> <br/>
                            <label> Desg : </label>
                            <input type="text" ref="desg" /> <br/>
                            <label> Blood Group : </label>
                            <input type="text" ref="bloodgroup" /> <br/>
                            <label> Email-Id : </label>
                            <input type="email" ref="regemail" /> <br/>
                            <label> Password : </label>
                            <input type="password" ref="regpassword" /> <br/>
                            <label> Subject Specification : </label>
                            <input type="text" ref="subspec" /> <br/>
                            <button onClick={this.submitHandler}>Submit</button>        
                    </div>;
        }
        
        return(
            <div className="App">
                {display} <br/>
               
            </div>
        );
    }
}
export class Sorry extends Component{
    render(){
        return(
            <div className="App">
                <center>
                    <br/>  <br/> <br/> <br/><br/> 
                   <h3>Sorry !!! , No Such Page.</h3> 
                </center>
            </div>
        );
    }
}