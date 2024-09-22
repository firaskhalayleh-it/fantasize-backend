import {Request , Response} from "express";

//----------------------- Register User-----------------------
export const s_signUpUser = async (req:Request , res :Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
}

//-----------------------Log In User-----------------------
export const s_loginUser = async (req:Request , res :Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
}
//-----------------------Log Out User-----------------------
export const s_logOutUser = async (req:Request , res:Response) => {
    try {

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
}