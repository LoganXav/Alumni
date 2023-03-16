import { useState, React, useEffect, } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar";
import ImageSlider from "./ImageSlider";
import Modal from "./Modal";
import AddMemory from "./AddMemory";
import { UserAuth } from "./context/AuthContext";
import { db } from "./firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

const App = () => {  
  
  const {user} = UserAuth()   
  const [searchTerm, setSearchTerm] = useState('')
  // Lifted up state from navbar. Keeps track of state for the search bar and selected filter
  const [selectedDept, setSelectedDept] = useState([])   
  const [students, setStudents] = useState([])    
    

  useEffect(() => {  

    // const fetchData = async () => {
       // Instead of setting students each time we get the individual data from the db. Add to list array first
    //   let list = []                                       
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     querySnapshot.forEach((doc) => {
    //       list.push({ id: doc.id, ...doc.data() })
    //     });
    // Each of the students are pushed into list and stored in students
    //     setStudents(list)                           

    //   } catch(error) {
    //     console.log(error)      
    //   }
    // }
    //   fetchData()

    // REAL TIME DATA FETCHING
      // Listens for changes in the collection with the snapshot method 
      const unsub = onSnapshot(collection(db, "users"), (snapshot) => {                               
      let list = []
      // For each document change, update the list
      snapshot.docs.forEach((doc) => {  
        // since each student needs an id and the collection doesn't provide an id but each document does, so we destructure it and set the id to the doc id                      
        list.push({id: doc.id, ...doc.data()})
      })
      setStudents(list)  
      // push list to students all together
      }, (error) => {
        console.log(error)
      })

      return () => {
        unsub()                                              // cleanup function so it doesn't listen when the component is unmounted
      }
      }, [])     
      

    // Place a protection ovrer a conponent
  const RequireAuth = ({ children }) => {
    return user ? (children) : <Navigate to="/"/>
  }  

  return ( 
    

     <BrowserRouter>
      <div>  
        <Navbar 
          searchTerm = {searchTerm}
          setSearchTerm = {setSearchTerm}
          selectedDept = {selectedDept}
          setSelectedDept = {setSelectedDept}
         />
        <Routes >
          <Route 
            path="/" 
            element= {
              <ImageSlider 
              students = {students} 
              searchTerm = {searchTerm} 
              selectedDept = {selectedDept}
            />}
          />

          <Route 
            path="/students/:id"
            element= {
              students && <Modal 
              students = {students}                  
            />} 
          />

          <Route              // if user signed in, allow to access addMemory, else error alert
            path="/addMemory"
            element= { <RequireAuth><AddMemory /></RequireAuth>} 
          />
        </Routes>
      </div>
    </BrowserRouter>
   
  
   );
}
 
export default App;




  