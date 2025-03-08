"use client"
import { useState, useEffect } from "react"
import { db } from "@/connection/firebase"
import { collection, getDocs } from "firebase/firestore"
import Navbar from "@/components/navbar"
import ai from "@/connection/genkit"

export default function Achados() {
  const [perdidos, setPerdidos] = useState([])
  const [docPerdidos, setDocPerdidos] = useState([])
  const [iamessage, setIaMessage] = useState([])
  const [docencontrados, setDocEncontrados] = useState([])

  useEffect(function () {
    const pegardados = async function () {
      const collectionRef = collection(db, 'pets')
      const documentoss = await getDocs(collectionRef)
      documentoss.forEach(doc => {
        console.log(doc.data())
        setPerdidos(prevState => [...prevState, doc.data()])
      })
    }
    pegardados()
  }, [])



  useEffect(() => {
    /**
     * Verifica se um determinado pet está  perdido.
     * Se sim, adiciona o pet a um array.
     * @param {Array} perdidos - lista de pets perdidos
     * @returns {Array} - lista de pets perdidos
     */
    const verificarPetPerdido = async function () {
      let doc = []
      perdidos.map(async (pet) => {
        if (pet.category === "PERDI UM PET") {
          doc.push(pet)
          setDocPerdidos(doc)
          console.log(doc)
        } else {
          setDocEncontrados(doc)
        }
      })
    }
    verificarPetPerdido()
  }, [perdidos])

  //ai('vamos programar em java?').then((res) => setIaMessage(res))

  console.log(iamessage)
  return (
    <>

      <div className=" h-screen p-4">
        <Navbar />
        <div className="text-6xl font-extrabold tracking-wider relative text-transparent bg-clip-text bg-gradient-to-r backdrop-blur-sm from-purple-400 to-blue-500 mt-40 mb-20">
          <span className="neon">Perdidos</span>
          <span className="neon-glow"></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          {docPerdidos.map((pet) => (
            <div key={pet.name} className="bg-gray-200 p-4 rounded-2xl relative shadow-lg backdrop-blur-sm">
              <div className="bg-red-500 w-full rounded-t-2xl p-2 text-white font-bold absolute top-0 left-0">
                Perdido
              </div>
              <img src={pet.photoURL} className="h-40 w-full object-cover" alt={pet.name} />
              <div className="mt-2">
                <h2 className="text-black font-bold text-xl">{pet.name}</h2>
                <p className="text-gray-600">{pet.description}</p>
                <p className="text-black font-bold mt-2">Local: {pet.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}