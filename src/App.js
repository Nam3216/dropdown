import logo from './logo.svg';
import {collection,getDocs,limit,query,startAfter,orderBy} from "firebase/firestore"
import database from "./Firebase"
import React,{useEffect, useState} from "react"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {addDoc  } from "firebase/firestore"//adddoc es lo q me permite agregar, collection para decirle a q collection agrega
import swal from 'sweetalert';


function App() {
  
  /*---------------------lista cdo lo llama firestore, lista actualizado con search---------------*/
  const[contact,setContacts]=useState([])
 // const[contactsOk,setContactsOk]=useState([])
 const[lastElement,setLastElement]=useState(0)

  /*---------------- modal----------------*/
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* info modal*/
  const[infoPut,setInfoPut]=useState({Nombre:"", RazonSocial:"", Nit:0,Telefono:0,Codigo:0})
  /* info search*/
  const[infoSearch,setInfoSearch]=useState("")
/*-------------------------------handle para guardar nuevo objeto-------------*/
  const handleInput=(e)=>{
    e.preventDefault()
  
   setInfoPut({...infoPut, [e.target.name]:e.target.value})
   

  }

 /*------------------------------------------------------------------*/

  /* llamo a firestore*/
  
  const getApi=async()=>{
 
    console.log(contact,"lastelementfirst")
    const itemsCollection=query(collection(database,"agenda"),orderBy("Codigo"),startAfter(lastElement), limit(20))//para q traiga 20 
    const contactSnapshot=await getDocs(itemsCollection)
    console.log(contactSnapshot.docs, "docs")
   
    
  

    const contactsList=contactSnapshot.docs.map((doc)=>{
      let contactOk=doc.data()
      contactOk.id=doc.id
    
      return contactOk
    })
    
  
   
  
   if(lastElement==0){
    setContacts(contactsList)
    /*esto no para buttonsetLastElement(20)*/
   }else{
    let list=contact
    //console.log(list,"contactlese")

    for (const item of contactsList){
      list.push(item)
    }
   
   // console.log(list,"listfinally")
     
   }
  
  // console.log(contactsList, "contactlist")

    setLastElement(contactsList[contactsList.length-1].Codigo)

   // console.log(lastElement, "lastvisible")
    return contactsList
    
  }

  

  
//guarda en firestore nuevo contacto
  const handleSubmit=async(e)=>{
    e.preventDefault()
    
    const orderFirebase=collection(database,"agenda")//la collection q cree en firb
    const addOrder=await addDoc(orderFirebase,infoPut)
    swal(`Se ha guardado el nuevo contacto bajo el id ${addOrder.id}`)

  }
/*-----------------------------------------------------------------------*/
  //funcion para buscador. el onchange del buscador activa esto
  const handleSearch=(e)=>{
    e.preventDefault()
 
    console.log(typeof(e.target.value), "value")
  
    setInfoSearch(e.target.value)
    //filtra en todos los campos
    setContacts(contact.filter(x=>x.RazonSocial.toLowerCase().includes(infoSearch.toLocaleLowerCase())||x.Nombre.toLowerCase().includes(infoSearch.toLocaleLowerCase())||x.Telefono.toString().includes(infoSearch)||x.Codigo.toString().includes(infoSearch)||x.Nit.toString().includes(infoSearch)))
      
    }

  
  /* intente activar el metodo getApi cdo se llegara al final de la pagina, pero el lastElement no quedaba guardado, sino que daba siempre 0*/
    /*const handleScroll=()=>{
      
     
      let elm=document.querySelector(".App")
      if ((window.innerHeight + window.scrollY) >= elm.offsetHeight){
        console.log(contact,"handl")
       getApi()

    }
   }

   useEffect(()=>{
    window.addEventListener("scroll",handleScroll)
    return ()=>{
      window.removeEventListener("scroll",handleScroll)
    }

   },[])  */

   
  return (
    <>
    <div className="App">
    
      <Dropdown onClick={getApi}>
        <Dropdown.Toggle variant="success" id="dropdown-basic" >
          Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleShow} >Nuevo Contacto</Dropdown.Item>
          
            <div>
            <input type="text" placeholder='Busca contacto' onChange={handleSearch}/>
           
            </div>
       
    
        </Dropdown.Menu>
      </Dropdown>

      <div className='contact-container'>
        {contact.map((item,index)=>{
          
          return(
            <div className='contacts' key={index} id={`${index}`} >
             
              <p>{index+1} </p>
              <p>Nombre: {item.Nombre} </p>
              <p>Razon Social: {item.RazonSocial} </p>
              <p>Nit: {item.Nit} </p>
              <p>Telefono: {item.Telefono} </p>
              <p>Codigo: {item.Codigo} </p>
              <hr/>
            </div>
          )
        })}
        
      </div>
      <button onClick={getApi} className="loadmore">Load more</button>
    </div>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nombre" name="Nombre" onChange={handleInput}/> 
            <input type="text" placeholder="Razon Social" name="RazonSocial" onChange={handleInput}/> 
            <input type="number" placeholder="Nit" name="Nit" onChange={handleInput}/> 
            <input type="number" placeholder="Telefono" name="Telefono" onChange={handleInput}/> 
            <input type="number" placeholder="Codigo" name="Codigo" onChange={handleInput}/> 
            <button type="submit">Guardar</button>
          </form>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>
 
    </>
  );
}

export default App;
   