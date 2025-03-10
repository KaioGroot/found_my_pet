"use client"
import React from "react";
import Image from "next/image";
import { useState, useEffect } from 'react'

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function pegarPets() {
      const response = await fetch('/encontrados.json', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      if (response.ok) {
        setData(result[3].result.data.json.data);
      } else {
        console.error('Falha na requisição:', response.statusText);
      }
    }

    pegarPets();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  } else {
    console.log(data)
  }

  return (
    <div className="flex flex-col p-8 pb-20 gap-40 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start mt-20">
        <h1 className="text-4xl sm:text-8xl font-bold">
          Found My{" "}
          <strong
            style={{
              WebkitTextStroke: "4px #FF00FF",
              MozTextStroke: "1px #FF00FF",
              textShadow: "0 0 10px #FF00FF",
            }}
            className="text-purple-200"
          >
            Pet
          </strong>
        </h1>
        <h2 className="text-md sm:text-4xl font-semibold">
          Find and share your lost pets with fellow pet lovers.
        </h2>
        <img className="w-1/4" src="https://www.viumeupet.com.br/_next/image?url=%2Fimages%2Fheroes%2Fhero.webp&w=750&q=75" alt="" />
        <div className="flex gap-4">
          <a

            onClick={() => window.location = "/anunciar"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground bg-gradient-to-tr from-[#ff7b00] to-[#cec002] text-background gap-2 hover:bg-foreground hover:bg-gradient-to-tr hover:from-[#e77171] hover:to-[#ffae00] text-md 2xl:text-base sm:h-12 px-4 sm:px-5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paw-print"><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="20" cy="16" r="2" /><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" /></svg>
            I Lost My Pet
          </a>
          <a className="text-md 2xl:text-base rounded-full sm:h-12 px-4 sm:px-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 bg-gradient-to-r from-[#FF00FF] to-[#FF8C00] hover:bg-[#383838] dark:hover:bg-[#ccc] hover:scale-105 transform transition-transform duration-300 ease-in-out" href="">
            I Found A Pet
          </a>
        </div>
      </main>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <div className="relative w-full h-40 mt-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF00FF] to-[#FF8C00] opacity-50 blur-3xl"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="card w-full h-1/2 p-4 bg-black rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-5xl font-bold neon">Viu?</span>
                <span className="text-2xl neon">E isso é só o começo</span>
                <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors">
                  Descubra mais
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold">Histórias em destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-10">
          {data.length > 0 ? (
            data.map((pet) => (
              <div key={pet.id} className="card">
                <img src={pet.pictureUrl} alt={pet.name} className="w-full h-48 object-cover  rounded-lg" />
                <div className="p-4  backdrop-blur-md  ">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br backdrop-blur-md   from-purple-500 to-red-800">{pet.name}</h3>
                  <p>{pet.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum pet encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
