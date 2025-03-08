"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import UserVerify from "@/app/action/userverify";
import Image from "next/image";

export default function Navbar() {
  const [verificaruser, setverificaruser] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setverificaruser(JSON.parse(storedUser));
    }
  }, []);

  const [showAdoptionPopup, setShowAdoptionPopup] = useState(false);
  const [showLostPopup, setShowLostPopup] = useState(false);

  return (
    <nav className="fixed font-[family-name:var(--font-geist-sans)]  w-full px-10 flex items-center justify-between p-4 bg-transparent text-black  left-0 top-0 z-10  bg-white bg-opacity-60 px-lg py-lg backdrop-blur-md desktop:px-0">
      <div className="flex items-center space-x-4">
        <Link href="/">Home</Link>
        <div
          className="relative"
          onMouseEnter={() => setShowAdoptionPopup(true)}
          onMouseLeave={() => setShowAdoptionPopup(false)}
        >
          <Link href="/adocao">Adoption</Link>
          {showAdoptionPopup && (
            <div className="absolute flex flex-col gap-2 left-0 top-full mt-0 w-48 px-4 py-4 bg-white text-black p-2 shadow-lg rounded">
              <Link
                className="px-2 rounded py-2 border border-gray-200"
                href="/adocao/cats"
              >
                Adoption Area
              </Link>
              <Link
                className="px-2 rounded py-2 border border-gray-200"
                href="/assistant"
              >
                Ia Assistant
              </Link>
              <Link className="px-2 rounded py-2 border" href="/adocao/dogs">
                Adopteds pets{" "}
              </Link>
              <Link className="px-2  rounded py-2 border" href="/adocao/others">
                How it works
              </Link>
            </div>
          )}
        </div>
        <div
          className="relative"
          onMouseEnter={() => setShowLostPopup(true)}
          onMouseLeave={() => setShowLostPopup(false)}
        >
          <Link href="/perdidos">Lost pets</Link>
          {showLostPopup && (
            <div className="absolute flex flex-col left-0 w-40 gap-2 top-full bg-white text-black p-20 px-4 py-20 shadow-lg rounded backdrop-blur-md">
              <Link
                className="px-2 py-2 rounded border border-gray-200"
                href="/perdidos"
              >
                Achados e Perdidos
              </Link>
              <Link
                className="px-2 py-2 rounded border border-gray-200"
                href="/perdidos/dogs"
              >
                Como funciona
              </Link>
              <Link
                className="px-2 py-2 rounded border border-gray-200"
                href="/perdidos/others"
              >
                Outros
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4 text-white">
        {UserVerify() && (
          <img
            width={40}
            height={40}
            src={verificaruser.photoURL}
            alt="Foto de perfil"
            className="w-10 h-10 rounded-full"
          />
        )}

        <Link href={"/anunciar"}>
          <button className="bg-purple-500 px-4 py-2 rounded">Anunciar</button>
        </Link>
        <Link href="/login">
          <button className="border border-purple-500 text-purple-500 px-4 hover:bg-purple-500 hover:text-white py-2 rounded">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}
