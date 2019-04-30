import React , { Component } from 'react';
import firebase from 'firebase';
import database from '../Config/firebase_config.js';
export default class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            signUpFlag : false,
            goFlag : false, // TODO: Change to false after doing Go Sub Spec...!!!
            subSpecNames : [],
            subSpecFlag : false,
            logOut : false,
            googleSignInFlag : false,
            logInFlagForDisplay : false,
            bloodGroupArray : [],
            bloodGroupSearchFlag : false,
            googleSingOutFlag : false,
            promiseFlag : false

        };
    }

    SignUpHandler = () =>{
        this.setState({signUpFlag:true,logOut:true});
        console.log('i am signuphanler...!!!')
    }

    SubmitHandler = () =>{
            console.log('i am submithan....')
            const name = this.refs.name.value;
            const rollnum = this.refs.rollnum.value;
            const bloodgroup = this.refs.bloodgroup.value;
            const email = this.refs.regemail.value;
            const password = this.refs.regpassword.value;
            console.log(email+'-> before auth');
            const auth = firebase.auth();
            console.log(email+'-> after auth');
            const promise = auth.createUserWithEmailAndPassword(email,password);
            promise
                .then( result =>{
                        console.log(result.user.email);
                            database.ref('Students/'+result.user.uid).set({
                                        Name : name,
                                        RollNum : rollnum,
                                        BloodGroup : bloodgroup,
                                        EmailId : email
                                });
                            this.setState({signUpFlag:false });
                            window.location.reload();
                        }
                );
            promise
               .catch( e =>{
                        alert(e.message);
                        this.setState({signUpFlag:true});
                        }
               );
    
    }

    LogInHandler = () =>{
        
        const email=this.refs.email.value;
        const password= this.refs.password.value;
        if(email === '' || password === '') 
        {
            alert("Please Enter Email,Password Input");
            return;
        }
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email,password);
        promise
            .then(
            this.setState({goFlag:true , logOut : true })                 
            );
        promise
           .catch( e =>{
                    alert(e.message);
                    this.setState({goFlag:false})
                }
           );
        alert("Check The Help Button Once...");
       
    }

    LogOutHandler = () =>{
        console.log('I am LogoutHandler');
        this.setState({logOut : false, goFlag : false});
        firebase.auth().signOut();
        console.log("Logged Out...!!!");
        window.location.reload();
    }
    
    googleSignInHandler = () =>{
        console.log('I am Google Sign In Handler');
        var provider = new firebase.auth.GoogleAuthProvider();
        var promise = firebase.auth().signInWithPopup(provider);
    
        promise.then(
            //First Parameter Should always be result to get the result Object
            result => {
                console.log(result);
                this.setState({promiseFlag : true});
                
            },
            console.log('I SignedIn with Google'),
            this.setState({googleSignInFlag:true,logInFlagForDisplay: true})
           
        );
        promise.catch();
    }

    googleSingOutHandler = () =>{
        console.log("I am GoogleSingOutHandler");
        firebase.auth().signOut().then(console.log("Logged Out from Google")).catch((e)=>alert(e.message));
        this.setState({logInFlagForDisplay:false,googleSignInFlag:false,bloodGroupArray:[]});
        alert("SignOut Is Applicable Only For This Tab");
        window.location.reload();
    }

    bloodGroupSearchHandler = () =>{
        console.log("I am Blood Group Search Handler");
        const reqBloodGroup = this.refs.bloodgroup.value; 
        if(this.state.promiseFlag){
            if(reqBloodGroup && reqBloodGroup === 'AB-' || reqBloodGroup === 'AB+' || reqBloodGroup === 'A-'
            || reqBloodGroup === 'A+' || reqBloodGroup === 'B-'|| reqBloodGroup === 'B+'
            || reqBloodGroup === 'O-' || reqBloodGroup === 'O+')
            {
                var result = database.ref('Students/');
                result.on('value',(snapshot)=>{
                                if(snapshot.val())
                                    // console.log(snapshot.val());
                                    var values = Object.values(snapshot.val());
                                    var bloodGroupArray = [];
                                    for ( var i = 0 ; i < values.length ; i++ )
                                    {
                                        if(values[i].BloodGroup === reqBloodGroup )
                                        {
                                            console.log(values[i].Name , values[i].RollNum);
                                            bloodGroupArray.push(values[i].RollNum);
                                        }                                   
                                    }
                                    if(!bloodGroupArray.length)
                                             bloodGroupArray.push('Sorry...!!!, Not Found'); 
                                    else
                                             bloodGroupArray.push('To Contact : 08674-273737 '); 
                                    this.setState({bloodGroupArray:bloodGroupArray,bloodGroupSearchFlag:true});
                            }
                        )
            }
            else if( reqBloodGroup === '' && reqBloodGroup !== 'AB-' || reqBloodGroup !== 'AB+' || reqBloodGroup !== 'A-'
                        || reqBloodGroup !== 'A+' || reqBloodGroup !== 'B-'|| reqBloodGroup !== 'B+'
                        || reqBloodGroup !== 'O-' || reqBloodGroup !== 'O+'
                    )
                    alert ('Wrong Input');
            else alert('Please Give Input'); 
        }  
        else alert("You Are Not LoggedIn...!!!\nClick Google SignOut to Refresh...!!!");                   
    }

    GoHandler = (e) =>{
        if(this.refs.subspec.value){
            const subspec = this.refs.subspec.value;
            var anysubspec;
            e.preventDefault();
            if(subspec === 'Computer Networks' || subspec === 'CN' || subspec === 'ComputerNetworks'
            ||  subspec === 'computernetworks' || subspec === 'COMPUTERNETWORKS' || subspec === 'COMPUTER NETWORKS'
            || subspec === 'cn' || subspec === 'computer networks')
            anysubspec = 'Computer Networks';
            anysubspec = this.refs.subspec.value;
            console.log('I am GoHandler');
            var result = database.ref('Faculty/');
            result.on('value',(snapshot)=>{
                                    if(snapshot.val())
                                            console.log('i am snapshot');
                                            var subSpecNames = [];
                                            var values = Object.values(snapshot.val());
                                            for( var i = 0 ; i < values.length ; i++)
                                            {
                                                if(values[i].SubjectSpecification === anysubspec)
                                                {
                                                    subSpecNames.push(values[i].Name);
                                                    // console.log(this.state.subSpecNames[0]);

                                                }
                                            }
                                            this.setState({subSpecNames : subSpecNames , subSpecFlag : true});
                                            console.log('i am setState');
                                    }                                    
                 );

        }  
        else 
        {
            alert('Enter Subject Specification'); 
            e.preventDefault();         
        }

    }

    HelpHandler = (e) =>{

        alert("To Search for Subjects\nComputer Networks - CN\nData Base Management System - DBMS\nCompiler Deisgn - CD\nWeb Technologies - WT");
        e.preventDefault();
    }

    render(){
        var display;
        var subSpecs;
        var googleSignIn;
        var bloodGroupMembers;
        if(this.state.signUpFlag === false && this.state.goFlag === false && this.state.logOut === false
                    && this.state.logInFlagForDisplay === false    
            )
        {
                display = <div>
                        <br/> <br/> <br/> <br/>
                        <h4>LogIn To Search For Faculty Subject Specialization </h4>
                        <label>Username : </label>
                        <input type="email" ref="email" /> <br/> <br/>
                        <label>Password : </label>
                        <input type="password" ref="password" /> <br/> <br/>
                        <button  onClick={ this.LogInHandler}>LogIn</button> {" "} 
                        <button onClick={this.SignUpHandler}>SignUp</button>
                     </div>;
        }
        else if(this.state.signUpFlag !== false)
        {
            display = <div>
                            <br/> <br/> <br/>
                                <h5> Registration Form </h5>
                                <label> Name : </label>
                                <input type="text" ref="name" /> <br/>
                                <label> Roll Num : </label>
                                <input type="text" ref="rollnum" /> <br/>
                                <label> Blood Group : </label>
                                <input type="text" ref="bloodgroup" /> <br/>
                                <label> Email-Id : </label>
                                <input type="email" ref="regemail" /> <br/>
                                <label> Password : </label>
                                <input type="password" ref="regpassword" /> <br/><br/>
                                <button onClick={this.SubmitHandler}>Submit</button>                       
                        </div>
            
        }
        else if(this.state.goFlag !== false && this.state.logOut !== false)
        {
            display = <div>
                            <br/> <br/> <br/>
                            <form onSubmit={this.LogOutHandler}>
                            <h5>Enter Subject Specification</h5> <br/>
                            <input type="text" placeholder="Enter Subject" ref="subspec"/>{' '}
                            <button onClick={this.GoHandler}>Go</button> <br/>
                            <button onClick={this.HelpHandler}>Help</button> <br/>
                            <input type="submit"  value="LogOut"/>
                            </form>
                    </div>
        }
        if(this.state.subSpecFlag !== false && this.state.logOut !== false)
        {
            display = <div>
                            <br/> <br/> <br/> 
                            <form onSubmit={this.LogOutHandler}>
                            <h5> Specified Faculty List </h5> 
                            <input type="submit"  value="LogOut"/>
                            </form>
                    </div>;
            subSpecs = this.state.subSpecNames.map((item,i)=>{
                                                        return <p key={i}>{item}</p>
                                                        console.log('i am map');
                                                }
                                )
        }
        if(this.state.logOut === false)
        {
            googleSignIn = <div>
                                <p >To Search For Blood Group SignIn With Google</p>
                                <button onClick={this.googleSignInHandler}>Google SignIn</button>
                            </div>;
        }
        else googleSignIn='';
        if(this.state.googleSignInFlag !== false)
        {
            googleSignIn = <div>
                            <p>Search For The Blood Group</p> 
                            <input type="text" placeholder="Enter Blood Group" ref="bloodgroup"/>{' '}
                            <button onClick={this.bloodGroupSearchHandler}>Search</button> <br/>
                            <button onClick={this.googleSingOutHandler}>Google SignOut</button>
                    </div>;
        }
        else if(this.state.googleSignInFlag === false && this.state.logInFlagForDisplay !== false)
        {
            googleSignIn = <div>
                                <p>To Search For Blood Group SignIn With Google</p>
                                <button onClick={this.googleSignInHandler}>Google SignIn</button>
                    </div>;
            display = '';
        }

        if(this.state.bloodGroupArray !== '' && this.state.bloodGroupSearchFlag !== false)
        {
            bloodGroupMembers = this.state.bloodGroupArray.map((item,i)=>
                                        {
                                            return <p key={i}>{item}</p>
                                        }
                         );
        }
        else bloodGroupMembers = '';
        return(
            <div>
                {display}   <br/>
                {subSpecs}
                {googleSignIn}
                {bloodGroupMembers}
            </div>
        );
    }
}