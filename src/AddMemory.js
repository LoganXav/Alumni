import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useContext } from 'react';
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from './firebase';
import { UserAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';


const AddMemory = () => {

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
            y: "10vh",
            opacity: 1,
            transition: { delay: 0.5, type: 'spring', stiffness: 30 }
        }
    }


    const navigate = useNavigate()
    const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            email: '',
            twitterHandle: '',
            instagramHandle: '',
            images: [],
            department: '',
            about: '',
        });
    
   
    const {user} = UserAuth()
    const [isUploading, setIsUploading] = useState(false)
    
    
        const handleSubmit = async (event) => {
            event.preventDefault();
            console.log("uploading")
            setIsUploading(true)

            try {

                const uploadedImageUrls = await Promise.all(
                formData.images.map(async (image) => {
                    const name = new Date().getTime() + image.name
                    const storageRef = ref(storage, `memory/${name}`);
                    const uploadTask = uploadBytesResumable(storageRef, image);
                    await uploadTask;
                    return getDownloadURL(storageRef);
                    })
                )            
                 
                const res = await setDoc(doc(db, "users", user.uid), {
                ...formData,
                images: uploadedImageUrls,
                timeStamp: serverTimestamp()
            });           
            
        } catch (error) {
            console.log(error)
        }  
        
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            twitterHandle: '',
            instagramHandle: '',
            images: [],
            department: '',
            about: ''
        })
        setIsUploading(true)
        navigate(-1)
        console.log("uploaded")
                    
        };
    
      const handleChange = (event) => {
            const { name, value } = event.target;          
        
            setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            }));           

         };


    return ( 
        <AnimatePresence mode ='wait'>
            <motion.div className='fixed top-0 left-0 w-full h-full backdrop-blur z-10'
                variants = {backdrop}
                initial = "hidden"
                animate = "visible"
                exit = "hidden"
                >
                <motion.div className='sm:w-full sm:h-screen flex items-center flex-col mt-0 mx-auto sm:pt-[0px] md:py-[40px]' 
                    variants= {modal}                    
                >
                    <form onSubmit={handleSubmit} className = "py-0 flex sm:w-[80%] md:w-[50%] flex-col sm:gap-2 md:gap-2 px-5 border text-white rounded-md">
                        <h1 className='text-white sm:text-[18px] md:text-[20px] sm:my-4 md:mt-4 font-bold text-center'>Add a Memory</h1>

                        <label className='mx-auto w-[70%]'>                            
                            <input
                            className='border w-full sm:text-xs md:text-[12px] pl-5 rounded-full border-gray-300 bg-transparent outline-none text-white p-1'
                            type="text"
                            name="firstName"
                            placeholder='First Name'
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            />
                        </label>

                        <label className='mx-auto w-[70%]'>                            
                            <input
                            className='border w-full sm:text-xs md:text-[12px] pl-5 rounded-full border-gray-300 bg-transparent outline-none text-white p-1'
                            type="text"
                            name="lastName"
                            placeholder = "Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            />
                        </label>

                        <label className='mx-auto w-[70%]'>                           
                            <input
                            className='border w-full pl-5 sm:text-xs md:text-[12px]  rounded-full border-gray-300 bg-transparent outline-none text-white p-1'
                            type="email"
                            name="email"
                            placeholder = "example@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            />
                        </label>

                        <label className='mx-auto w-[70%]'>                            
                            <input
                            className='border w-full pl-5 sm:text-xs md:text-[12px] rounded-full border-gray-300 bg-transparent outline-none text-white p-1 '
                            type="text"
                            name="twitterHandle"
                            placeholder = "@twitter"
                            value={formData.twitterHandle}
                            onChange={handleChange}
                            />
                        </label>

                        <label className='mx-auto w-[70%]'>                         
                            <input
                            className='border w-full pl-5 sm:text-xs md:text-[12px] rounded-full border-gray-300 bg-transparent outline-none text-white p-1'
                            type="text"
                            name="instagramHandle"
                            placeholder = "@instagram"
                            value={formData.instagramHandle}
                            onChange={handleChange}
                            />
                        </label> 
                        <span className="flex justify-center text-[12px]">Add Photos</span>
                        <label className='flex sm:flex-col md:flex-row mx-auto md:justify-between'>
                            
                            <label className='sm:flex sm:flex-wrap md:block md:w-1/2'>
                                <label className='flex flex-col w-1/2 items-start py-1'>
                                    
                                    <input
                                    type="file"
                                    className='
                                        p-1 rounded-full sm:text-[7px] md:text-[8px] sm:border-none
                                        file:bg-white
                                        file:px-2 file:py-1 file:m-1 file:mr-3 
                                        file:border-none
                                        file:rounded-full
                                        file:text-black
                                        file:cursor-pointer'
                                        
                                    name="image0"
                                    onChange={(event) =>
                                        setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        images: [...prevFormData.images, event.target.files[0]],
                                        }))
                                    }
                                    />
                                </label>

                                <label className='flex flex-col w-1/2 items-start py-1'>                            
                                    <input
                                    type="file"
                                    className='
                                        p-1 rounded-full sm:text-[7px] md:text-[8px] sm:border-none
                                        file:bg-white
                                        file:px-2 file:py-1 file:m-1 file:mr-3
                                        file:border-none
                                        file:rounded-full
                                        file:text-black
                                        file:cursor-pointer'
                                    name="image1"
                                    onChange={(event) =>
                                        setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        images: [...prevFormData.images, event.target.files[0]],
                                        }))
                                    }
                                    />
                                </label>

                                <label className='flex flex-col w-1/2 items-start py-1'>                            
                                    <input
                                    type="file"
                                    className='
                                        p-1 rounded-full sm:text-[7px] md:text-[8px] sm:border-none
                                        file:bg-white
                                        file:px-2 file:py-1 file:m-1 file:mr-3
                                        file:border-none
                                        file:rounded-full
                                        file:text-black
                                        file:cursor-pointer'
                                    name="image2"
                                    onChange={(event) =>
                                        setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        images: [...prevFormData.images, event.target.files[0]],
                                        }))
                                    }
                                    />
                                </label>

                                <label className='flex flex-col w-1/2 items-start py-1'>                            
                                    <input
                                    type="file"
                                    className='
                                        p-1 rounded-full sm:text-[7px] md:text-[8px] sm:border-none
                                        file:bg-white
                                        file:px-2 file:py-1 file:m-1 file:mr-3
                                        file:border-none
                                        file:rounded-full
                                        file:text-black
                                        file:cursor-pointer'
                                    name="image3"
                                    onChange={(event) =>
                                        setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        images: [...prevFormData.images, event.target.files[0]],
                                        }))
                                    }
                                    />
                                </label>

                                <label className='flex flex-col w-1/2 items-start py-1'>                            
                                    <input
                                    type="file"
                                    className='
                                        p-1 rounded-full sm:text-[7px] md:text-[8px] sm:border-none
                                        file:bg-white
                                        file:px-2 file:py-1 file:m-1 file:mr-3
                                        file:border-none
                                        file:rounded-full
                                        file:text-black
                                        file:cursor-pointer'
                                    name="image4"
                                    onChange={(event) =>
                                        setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        images: [...prevFormData.images, event.target.files[0]],
                                        }))
                                    }
                                    />
                                </label>
                            </label>

                            <label className='flex flex-col p-3 bg-transparent'>

                                <label className='sm:mt-3 md:mt-8 w-1/2'>                                    
                                    <textarea name="about" 
                                        value={formData.about} onChange={handleChange} 
                                        placeholder="Write something about yourself..."
                                        className='textarea overflow-hidden h-24 sm:w-[200px] md:w-[200px] bg-transparent border-gray-400 border rounded-md p-7 text-[12px] outline-none resize-none'
                                        >                                        
                                    </textarea>
                                </label>

                                <label className='w-1/2 mt-2'>                                   
                                    <select name="department" 
                                            value={formData.department}     
                                            onChange={handleChange}
                                            className="select h-8 w-36 border rounded px-2 py-2 bg-transparent text-white text-[10px] outline-none">
                                    <option className="text-black bg-[gray] border" value="">Select Department</option>
                                    <option className="text-black bg-[gray] border" value="ABE">ABE</option>
                                    <option className="text-black bg-[gray] border" value="CVE">CVE</option>
                                    <option className="text-black bg-[gray] border" value="ELE">ELE</option>
                                    <option className="text-black bg-[gray] border" value="MCE">MCE</option>
                                    <option className="text-black bg-[gray] border" value="MTE">MTE</option>
                                    </select>
                                </label>

                            </label>
                        </label>
                        <button className='btn2 bg-[gray] sm:my-6 md:my-2 self-center' type="submit" disabled={isUploading} >  {isUploading ? 'Uploading...' : 'Submit'} </button>
                </form>
            </motion.div>
        </motion.div>          
    </AnimatePresence>
  );
}
 
export default AddMemory