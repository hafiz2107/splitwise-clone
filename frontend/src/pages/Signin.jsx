import { useForm } from "react-hook-form";
import InputField from "../components/shared/InputField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastError } from "../common/functions";

export default function Signin(){
    const navigation = useNavigate()
    const { register, handleSubmit } = useForm();
    const apiBaseUrl = process.env.REACT_APP_API_URL
    const onSubmit = (data,event) =>{
        axios.post(`${apiBaseUrl}/get-user`,data).then((response)=>{
            if(response.data.success){
                const {data} = response.data
                Object.keys(data).map((key)=>localStorage.setItem(key,data[key]))
                navigation("/home")
            }else{
                ToastError("Unautherised")
            }
        })
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
            <InputField
                name={"username"}
                type={"text"}
                id={"username"}
                title={"Username"}
                required={true}
                placeholder={"Username"}
                register={register}
            />
            <InputField
                name={"password"}
                type={"password"}
                id={"password"}
                title = {"Password"}
                required={true}
                placeholder={"Password"}
                register={register}
            />
            <input type="submit" />
        </form>
    )
}

