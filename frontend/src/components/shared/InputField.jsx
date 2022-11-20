import '../../styles/App.css'
import {TextField} from '@mui/material'

export default function InputField({name, type, id, title,required,register}) {
  return (
    <>
      <div className="textfield">
        <TextField type={type} name={name} id={id} label={title} variant="outlined" required={required} {...register(name)}/>
      </div>
    </>
  );
}
