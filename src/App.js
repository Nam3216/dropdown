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
let lastVisible
  /* llamo a firestore*/
  const getApi=async()=>{
    
    const itemsCollection=query(collection(database,"agenda"),orderBy("Codigo"),limit(20))//para q traiga 20 
    const contactSnapshot=await getDocs(itemsCollection)
   
    
    console.log("last", lastVisible)

    const contactsList=contactSnapshot.docs.map((doc)=>{
      let contact=doc.data()
      contact.id=doc.id
      return contact
    })
    console.log(contactsList, "contacts")
    lastVisible = contactsList[contactsList.length-1];
    console.log(lastVisible,"ok")
    setContacts(contactsList)
    return contactsList
    
  }

  //ver si se puede hacer con startafter, aunque ahi estaria ok, siempre trae 20 mas
  //ponerle en vez de boton, scroll down
  const getApi1=async()=>{
    alert("more1")
    
    const itemsCollection=query(collection(database,"agenda"),limit(contact.length+20))//,startAfter(lastVisible))//para q traiga 20 
    const contactSnapshot=await getDocs(itemsCollection)
   

   
    const contactsList=contactSnapshot.docs.map((doc)=>{
      let contact=doc.data()
      contact.id=doc.id
      return contact
    })
    console.log(contactsList, "contacts")
    setContacts(contactsList)
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
            <button onClick={()=>alert(infoSearch)}>click</button>
            </div>
       
          <Dropdown.Item >Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <div>
        {contact.map((item,index)=>{
          
          return(
            <div className='contacts' key={index} >
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
        <button onClick={getApi1}>More</button>
      </div>
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
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
 
    </>
  );
}

export default App;
   //<ModalOk show={show} handleClose={handleClose}/>

/* para obtener un solo doc especifico

import { doc, getDoc } from "firebase/firestore";
import db from "..."

const getProduct=async()=>{
    const docRef = doc(db, "listProducts", id);//el id lo saco del useParams q deberia estar en ese compoente. como ya estoy usando el id del firebase, lo q se muestre en url es el id de firebase, lo toma con useParams
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {//si existe muestra data
        console.log("Document data:", docSnap.data());
        let product=docSnap.data()//con estos 3 renglones guardo en product la info, le agrego el id, y lo guardo en estate para usarlo
        product.id=docSnap.id//guardo id porque no esta en data
        setProduct(product)
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        navigate("/error") //esto se puede agregar o no, es para si hay error manda auna pagina error, para eso tengo q poner import naigate como dice abajo
      }

}

useEffect(()=>{
    getProduct
},[])*/