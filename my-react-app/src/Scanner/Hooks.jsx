import axios from 'axios';
import { use, useState } from 'react';

const API_URL="http://localhost:7000/api";



const useAuth=()=>{
  const [report, setReport] = useState(null);
 const [load,setLoad]=useState(false)
const xrayScanner = async (file) => {
  try {
    const formData = new FormData();
    formData.append("xray", file);

    const res = await axios.post(`${API_URL}/scan`, formData);

    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

  

return{
    xrayScanner,
}

    
}



export default useAuth;