import { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaPlus, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { UserAuth } from './context/AuthContext';
import { useNavigate } from "react-router-dom";


const Navbar = ({searchTerm, setSearchTerm, setSelectedDept}) => {
    
    const [selectedButton, setSelectedButton] = useState("")             // keeps track of state of the selected buttons for styling
    const navigate = useNavigate()


    const handleClick = (dept) => {
        setSelectedDept((prevState) =>
          prevState.includes(dept)
            ? prevState.filter((selected) => selected !== dept)
            : [dept]
        );
        setSelectedButton((prev) => 
          prev === dept ? prev = "" : dept)                          // new dept selected, replace the prev. prev selected, return stated to an empty string
      }   

      const {user, signInWithGoogle, logOut} = UserAuth()      
      
      const handleGoogleSignIn = async () => {
        try{
            
            if(user) {                              // if user is authenticated
                if(window.confirm("Are you sure you want to sign out?")){
                    logOut()
                    window.alert("You are signed out")
                }
            } else {
                await signInWithGoogle()                
                
            }
        } catch (error) {
            console.log(error)                       
        }       
      }  
      
      const handleNavigate = () => {
        
        if (user) {
          navigate("/addMemory");
        } else {
          window.alert("Please sign in to add a memory.");
        }
      };
    
    return ( 
        <div className=''>         
           
                <motion.div className='flex origin-center max-w-[100vw] justify-between items-center m-[30px] border-b-[1px]'
                     initial={{ scaleX: 0}}
                     animate={{ scaleX: 1 }}
                     transition={{ duration: 0.5, delay: 0.2}}>
                    <motion.h1 className="text-white sm:text-[15px] md:text-[20px] tracking-wider font-bold animate-pulse uppercase" 
                        initial={{ y: -300}}
                        animate={{ y: -10 }}
                        transition={{duration: 0.9, delay: 0.5, type: 'spring', stiffness: 120 }}>
                        <a href="/"><i>coleng alumni</i></a>
                    </motion.h1>
                    <motion.div className='flex items-center' 
                        initial={{ y: -300}}
                        animate={{ y: -10 }}
                        transition={{duration: 0.9, delay: 0.5, type: 'spring', stiffness: 120 }}>
                        <button onClick={handleGoogleSignIn} className={`btn2 ${user == null ? 'bg-transparent text-white animate-pulse' : 'bg-white text-black'}`}><FaUser /></button> 
                                              
                    </motion.div>                    
                </motion.div>
            <div className='flex justify-center'>
                <motion.div 
                    className="relative flex items-center sm:w-[250px] md:w-[500px] rounded-full bg-transparent border border-gray-400"
                     initial={{ x: '100vw'}}
                     animate={{ x: 0 }}
                     transition={{duration: 5, delay: 0.7, type: 'spring', stiffness: 70 }}>
                        <input                    
                            className= "sm:text-[10px] md:text-[12px] md:w-full px-4 sm:py-1 md:py-2 bg-transparent border-none text-white leading-tight focus:outline-none"
                            type="text"
                            placeholder="Find your friends..."
                            value={searchTerm}                                 //the searched term is passed up in state to be consumed by in the image slider
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <BsSearch className="text-white sm:text-[12px] cursor-pointer" />
                        </div>
                        
                </motion.div>
                
                    <motion.div onClick={handleNavigate} className="rounded-full md:flex ml-5 sm:hidden items-center font-light transition ease-out duration-500 sm:p-5 md:p-3 sm:text-[16px] md:text-[16px] bg-[gray] text-white uppercase md:cursor-pointer border md:hover:bg-white md:hover:text-black"
                                    initial={{ scaleX: 0}}
                                    animate={{ scaleX: 1 }}
                                    transition={{duration: 5, delay: 3.5, type: 'spring', stiffness: 90 }}
                                    ><FaPlus />
                    </motion.div>
                
                                       
            </div>                              
            
            <div className='flex justify-center mt-3 sm:w-full'>
                    
                    <motion.div 
                        className={`btn2 ${selectedButton === 'ABE' ? 'bg-white text-white' : 'bg-transparent text-white'}`}         //conditional styles based on the states of the selected button (dept)
                        initial={{ x: '-100vw'}}
                        animate={{ x: 0 }}
                        transition={{duration: 5, delay: 1.6, type: 'spring', stiffness: 30 }}
                        onClick={() => handleClick('ABE')}
                        >ABE
                    </motion.div>
                    <motion.div 
                        className={`btn2 ${selectedButton === 'CVE' ? 'bg-white text-white' : 'bg-transparent text-white'}`}
                        initial={{ x: '-100vw'}}
                        animate={{ x: 0 }}
                        transition={{duration: 5, delay: 1.0, type: 'spring', stiffness: 30 }}
                        onClick={() => handleClick('CVE')}
                        >CVE
                    </motion.div>
                    <motion.div 
                        className={`btn2 ${selectedButton === 'ELE' ? 'bg-white text-white' : 'bg-transparent text-white'}`}
                        initial={{ x: '100vw'}}
                        animate={{ x: 0 }}
                        transition={{duration: 5, delay: 1.3, type: 'spring', stiffness: 30 }}
                        onClick={() => handleClick('ELE')}
                        >ELE
                    </motion.div>
                    <motion.div 
                        className={`btn2 ${selectedButton === 'MCE' ? 'bg-white text-white' : 'bg-transparent text-white'}`}
                        initial={{ x: '100vw'}}
                        animate={{ x: 0 }}
                        transition={{duration: 5, delay: 1.9, type: 'spring', stiffness: 30 }}
                        onClick={() => handleClick('MCE')}
                        >MCE
                    </motion.div>
                    <motion.div 
                        className={`btn2 ${selectedButton === 'MTE' ? 'bg-white text-white' : 'bg-transparent text-white'}`}
                        initial={{ x: '100vw'}}
                        animate={{ x: 0 }}
                        transition={{duration: 5, delay: 2.2, type: 'spring', stiffness: 30 }}
                        onClick={() => handleClick('MTE')}
                        >MTE
                    </motion.div>                    
            </div>         
        </div>        
     );
}
 
export default Navbar;