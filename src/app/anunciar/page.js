"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Image } from "next/image"
import { useRouter } from "next/navigation"
import { CldImage, getCldImageUrl } from 'next-cloudinary';
import { CldUploadWidget, CldUpload, CldUploadButton } from "next-cloudinary"
import { addDoc, collection, doc, getDocs } from "firebase/firestore"
import { QuerySnapshot } from "firebase/firestore"
import { db } from "../../connection/firebase"

export default function Anunciar() {
  const [pet, setPet] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    city: "",
    state: "",
    description: "",
    photo: null,
    category: "",
  });
  const [image, setImage] = useState(null);
  const [perdidos, setPerdidos] = useState([]);
  const [resource, setResource] = useState([]);
  const [dadosip, setDadosip] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', pet.name);
    formData.append('breed', pet.breed);
    formData.append('age', pet.age);
    formData.append('weight', pet.weight);
    formData.append('city', pet.city);
    formData.append('state', pet.state);
    formData.append('photo', pet.photo);

    try {
      const response = await fetch('/api/anuncio/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pet),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert('Anúncio enviado com sucesso!');

      const createTable = async () => {
        try {
          await addDoc(collection(db, "pets"), pet);
        } catch (error) {
          console.error('Error creating table:', error);
        }
      };
      createTable();

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    const imagem = reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
    console.log(imagem);
  };

  useEffect(() => {
    console.log(pet)
  }, [pet]);


  //código para pegar os pets que estão em doação

  useEffect(() => {
    const fetchDocuments = async () => {
      const querySnapShot = await getDocs(collection(db, "pets"))
      querySnapShot.forEach(async (doc) => {
        console.log(doc.id, " => ", doc.data());
        setPerdidos(prevState => [...prevState, doc.data()])
      })
    }
    fetchDocuments()

  }, [])


  //código para pegar dados do usuário

  useEffect(() => {
    const fetchip = async () => {
      const ip = await fetch('https://api.ipify.org').then(response => response.text())
      console.log(ip + "ip")
      //pegar dados do usuário usando o ip
      const result = await fetch(`http://ip-api.com/json/${ip}`).then(response => response.json()).then(data => {
        //console.log(data)
        setDadosip(data)
      })
    }
    fetchip()
  }, [])

  return (
    <div className="container flex w-full  mx-auto px-4 py-24 rounded-full backdrop-blur-3xl   mt-20 font-[family-name:var(--font-geist-sans)] bg-purple-50">
      <div className=" md:flex-col flex justify-between md:w-1/2 rounded backdrop-blur-3xl  px-4 py-4 bg-purple-200 md:overflow-y-auto md:border-r md:border-gray-200">
        <div className="p-4 bg-white rounded-lg shadow-lg mt-4">
          <h2 className="text-3xl text-gray-600 font-bold">Criar anúncio pet</h2>
          <p className="mt-2">Basta criar um anuncio com as informações do seu pet e ele ser  publicado na nossa plataforma. Compartilhe o anuncio com os amigos e familiares para que possam ajudar a encontrar o seu pet.</p>
        </div>
        <div>
          <img src="https://th.bing.com/th/id/R.d50688743fab4e9d86d2bf01bc24fe86?rik=09O0YI6q0SntOA&pid=ImgRaw&r=0" alt="" />
        </div>
        <div>
          <p className="mt-4">Nossa plataforma tem <strong className="">{perdidos.length}</strong> pets perdidos cadastrados, cadastre o seu pet para que possamos ajudá-lo a encontrar</p>
        </div>
      </div>
      <div className="flex flex-col justify-end items-end shadow-lg p-4 rounded-lg">
        <h1 className="text-3xl font-bold">Anunciar</h1>
        <p className="text-lg">Cadastre seu pet perdido para que possamos ajudá-lo a encontrar</p>
        <form onSubmit={handleSubmit} className="flex flex-col mt-4">
          <label htmlFor="name">Nome do pet</label>
          <input onChange={e => setPet({ ...pet, name: e.target.value })} type="text" id="name" className="py-2 px-4 rounded-md border-2 border-purple-600" />
          <label htmlFor="breed">Raça do pet</label>
          <input required onChange={e => setPet({ ...pet, breed: e.target.value })} type="text" id="breed" className="py-2 px-4 rounded-md border-2 border-purple-600" />
          <label htmlFor="age">Idade do pet</label>
          <input required onChange={e => setPet({ ...pet, age: e.target.value })} type="number" id="age" className="py-2 px-4 rounded-md border-2 border-purple-600" />
          <label htmlFor="weight">Peso do pet</label>
          <input required onChange={e => setPet({ ...pet, weight: e.target.value })} type="number" id="weight" className="py-2 px-4 rounded-md border-2 border-purple-600" />
          <label htmlFor="city">Cidade</label>
          <input required defaultValue={dadosip.city} onChange={e => setPet({ ...pet, city: e.target.value })} type="text" id="city" className="py-2 px-4 rounded-md border-2 border-purple-600 " />
          <label htmlFor="state">Estado</label>
          <input required defaultValue={dadosip.regionName} onChange={e => setPet({ ...pet, state: e.target.value })} type="text" id="state" className="py-2 px-4 rounded-md border-2 border-purple-600" />
          <label htmlFor="category">Categoria do anúncio</label>
          <select required onChange={e => setPet({ ...pet, category: e.target.value })} id="category" className="py-2 px-4 rounded-md border-2 border-purple-600">
            <option value="">Selecione uma opção</option>
            <option value="ENCONTREI UM PET">Encontrei um pet</option>
            <option value="PERDI UM PET">Perdi um pet</option>
          </select>
          <label htmlFor="photo">Foto do pet</label>
          <input required onChange={e => {
            setPet({ ...pet, photo: e.target.files[0].name })
            handleImageChange(e)
          }} type="file" id="photo" className="py-2 px-4 rounded-md border-2 border-purple-600" />
          <label htmlFor="description">Descrição do pet e como perdeu ou encontrou o mesmo.</label>
          <textarea
            onChange={e => setPet({ ...pet, description: e.target.value })}
            id="description"
            className="py-2 px-4 rounded-md border-2 border-purple-600"
            rows="4"
          ></textarea>

          <button type="submit" className="bg-gradient-to-r from-purple-400 to-blue-600 text-lg text-white font-bold py-2 px-4 mt-4 rounded-md">Anunciar</button>
        </form>
        <CldUploadButton
          onUpload={(error, result, widget) => {
            onChange((e) => console.log(e));
            if (error) {
              console.error('Error:', error);
            } else {
              alert('Success:', result);
              setResource(result);// { public_id, secure_url, etc }

            }
            widget.close();
          }}
          className="bg-gradient-to-r from-purple-400 to-blue-600 text-lg text-white font-bold py-2 px-4 mt-4 rounded-md"
          uploadPreset="signedverify"
        >
          Upload to Cloudinary
        </CldUploadButton>
        {resource && (
          <div>
            <p>Public ID: {resource.public_id}</p>
            <p>Secure URL: {resource.secure_url}</p>
            <p>Width: {resource}</p>
            <img src={resource.secure_url} alt="" />
          </div>
        )}
        <div className="flex mt-10">
          {image && (
            <CldImage
              width="420"
              height="800"
              src={image}
              recolor={'blue'}
              angle={15}

              crop={{
                type: 'crop',
                width: 40,
                height: 400,
                x: 80,
                y: 350,
                gravity: 'north_east',
                source: true
              }}
              alt="Description of my image"
              style={{
                objectFit: "cover",
                borderRadius: "52px",
                marginBottom: "20px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
};
