import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaInstagram, FaQuoteLeft, FaQuoteRight, FaLongArrowAltRight, FaTimes, FaTwitter, FaUser, FaTrash, FaCamera } from 'react-icons/fa'
import { AiOutlineMail } from 'react-icons/ai'
import Typewriter from './Typewriter'
import dummyUser from './asset/images.png'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { UserAuth } from './context/AuthContext'
import { db, storage } from './firebase'
import { useRef, useState } from 'react'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'





const Modal = ({ students }) => {
    
    const {user} = UserAuth()
    
    const { id } = useParams();     
    const student = students.find(student => student.id == id);      // type coercion  
    const navigate = useNavigate()  
    // Check that the student whose page we're in matches the signed in user's id for authorization to edit posts
    // The optional chaining operator allows you to safely access nested properties of an object without throwing an error 
    // if the property or any of its parent objects is null or undefined
    const check = user?.uid == id ? true : false
         

    const backdrop = {
        visible: {opacity: 1},
        hidden: {opacity: 0}
    }
    const modal = {
        hidden: {
            y: "-100vh",
            opacity: 0
        },
        visible: {
            y: "100px",
            opacity: 1,
            transition: { delay: 0.5, type: 'spring', stiffness: 30 }
        }
    }   

    
    
    const fileInputRef = useRef(null)
    const [file, setFile] = useState([])

    // Link the camera icons to the file upload input using useRef hook
    const handleClick = (index) => {
        fileInputRef.current.click();
        
        
    };    
    
    const handlePost = async (event) => {
        
        const imageRef = doc(db, "users", user.uid)
        setFile([event.target.files[0]])
        console.log("uploading")
                
            // Get the download URL for the new image
        try {
                const uploadedImageUrls = await Promise.all(
                file.map(async (image) => {
                    const name = new Date().getTime() + image.name
                    
                    const storageRef = ref(storage, `memory/${name}`);
                    
                    const uploadTask = uploadBytesResumable(storageRef, image);
                    await uploadTask;
                    return getDownloadURL(storageRef);
                    })
                )   
                // Join the new image url to the previous student images array
                const updatedImages = student.images.concat(uploadedImageUrls);                    
                
                await updateDoc(imageRef, {
                    images: updatedImages,
                    timeStamp: serverTimestamp()
                });
                console.log("done") 
                                    
            
        } catch (error) {
            console.log(error)
        }        
    }
    

    const handleDelete = async (index) => {       
              

        const updatedImages = [...student.images]
        updatedImages.splice(index, 1)
        
        // Update the 'images' field in the document with the updated array
        const imageRef = doc(db, 'users', user.uid)
        if(window.confirm("Are you sure you want to delete this image?")){
            await updateDoc(imageRef, {
                images: updatedImages
            });            
            window.alert("Deleted Successfully")
        }

    }    
   

    return(
        <AnimatePresence mode='wait'>            
            <motion.div className='fixed top-0 left-0 w-full h-full backdrop-blur z-10'
                variants = {backdrop}
                initial = "hidden"
                animate = "visible"
                exit = "hidden"
                >
                <motion.div className='sm:w-full sm:h-screen flex items-center flex-col md:max-w-[1200px] mt-0 mx-auto py-[40px]' 
                    variants= {modal}                    
                >
                    <div className='flex justify-center items-center'>
                        { student && <h1 className=" text-white text-xl" >{student.firstName + " " + student.lastName}</h1>}
                        <FaLongArrowAltRight className='text-white w-[30px] mx-5'/>
                        { student && <p className='text-white flex justify-center items-center'>{student.department}</p>}
                    </div>                           
                   {student && <div className='grid md:grid-cols-4 sm:grid-cols-2 sm:gap-2 mx-auto sm:my-[20px] md:my-[50px]'>
                        <div className='relative'>
                            {check && (student.images[1] ? <FaTrash onClick={() => handleDelete(1)} className="absolute top-[87%] text-white cursor-pointer w-[30px] right-[10%] transform hover:scale-125 transition duration-300"/> : <FaCamera onClick={() => handleClick(1)} className="absolute top-[87%] text-white cursor-pointer w-[30px] right-[15%] transform hover:scale-125 transition duration-300"/>)}
                            <img className="rounded-md sm:w-[130px] md:w-[250px] sm:h-[130px] md:h-[250px] object-cover"  src={student.images[1] || dummyUser} alt="" />
                        </div>
                        <div className='relative'>
                            {check && (student.images[2] ? <FaTrash onClick={() => handleDelete(2)} className="absolute top-[87%] text-white cursor-pointer w-[30px] right-[10%] transform hover:scale-125 transition duration-300"/> : <FaCamera onClick={() => handleClick(2)} className="absolute top-[87%] text-white cursor-pointer w-[30px] right-[15%] transform hover:scale-125 transition duration-300"/>)}
                            <img className="rounded-md sm:w-[130px] md:w-[250px] sm:h-[130px] md:h-[250px] object-cover"  src={student.images[2] || dummyUser} alt="" />
                        </div>
                        <div className='relative'>
                            {check && (student.images[3] ? <FaTrash onClick={() => handleDelete(3)} className="absolute top-[87%] text-white cursor-pointer w-[30px] right-[10%] transform hover:scale-125 transition duration-300"/> : <FaCamera onClick={() => handleClick(3)} className="absolute top-[87%] text-white cursor-pointer w-[30px] right-[15%] transform hover:scale-125 transition duration-300"/>)}
                            <img className="rounded-md sm:w-[130px] md:w-[250px] sm:h-[130px] md:h-[250px] object-cover"  src={student.images[3] || dummyUser} alt="" />
                        </div>
                        <div className='relative'>
                            {check && (student.images[4] ? <FaTrash onClick={() => handleDelete(4)} className="absolute top-[87%] text-white cursor-pointer w-[30px] right-[10%] transform hover:scale-125 transition duration-300"/> : <FaCamera onClick={() => handleClick(4)} className="absolute top-[87%] text-white cursor-pointer w-[30px] right-[15%] transform hover:scale-125 transition duration-300"/>)}
                            <img className="rounded-md sm:w-[130px] md:w-[250px] sm:h-[130px] md:h-[250px] object-cover"  src={student.images[4] || dummyUser} alt="" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handlePost}
                        />
                    </div>}
                    <div className="text-white flex justify-center items-center sm:text-sm" >
                        <FaQuoteLeft className="w-[10px] mx-5"/>
                        <Typewriter student={student} />
                        <FaQuoteRight className="w-[10px] mx-5"/>
                    </div>
                    <h2 className="text-white flex justify-center items-center sm:mt-[50px] sm:text-xs md:text-md md:mt-[70px]" >Connect with me</h2>
                    <ul className="flex justify-center items-center mt-3" >
                        <li className="text-white text-[30px] mx-[40px]" ><a href=""><FaTwitter /></a></li>
                        <li className="text-white text-[30px] mx-[40px]" ><a href=""><FaInstagram /></a></li>
                        <li className="text-white text-[30px] mx-[40px]" ><a href=""><AiOutlineMail /></a></li>
                    </ul>
                    <motion.div onClick={() => navigate("/")}className='rounded-full absolute sm:hidden md:top-[0px] md:right-[5vw] md:flex items-center transition ease-out duration-500 mx-2 sm:p-5 md:p-3 sm:text-[18px] md:text-[20px] bg-[gray] text-white uppercase cursor-pointer border hover:bg-white hover:text-black'>
                        
                            <FaTimes/>
                         
                    </motion.div>
                </motion.div>
            </motion.div>          
        </AnimatePresence>
    )
}

export default Modal