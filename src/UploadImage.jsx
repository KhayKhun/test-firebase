import {React,useState,useEffect} from 'react'
import {storage} from './firebase'
import { ref ,uploadBytes,listAll,getDownloadURL } from 'firebase/storage'
import {v4} from 'uuid'

function UploadImage() {
    const [imageUpload,setImageUpload] = useState();
    const [imageList,setImageList] = useState([]);

    function uploadImage(){
        if(!imageUpload) return;
        else{
            uploadBytes(ref(storage,`images/${imageUpload.name+v4()}`) , imageUpload) //ref indicates the path in firebase storage
            .then(response => {
                getDownloadURL(response.ref).then(url => {
                    setImageList((prev) => [...prev,url]);
                })
            })
        }
    }
    useEffect(()=>{
        listAll(ref(storage,"images/")).then(response => 
            response.items.forEach(item=>{
                getDownloadURL(item).then(url => {
                    setImageList((prev) => [...prev,url]);
                })
            })
        );
    },[])
  return (
    <div>
        <input type="file" onChange={(e)=>{setImageUpload(e.target.files[0])}}/>
        <button onClick={uploadImage}>Upload</button>
        <div className="images">
        {
            imageList.map(url => {
                return <img src={url}/>
            })
        }
        </div>
    </div>
  )
}

export default UploadImage