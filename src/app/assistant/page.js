"use client"
import ai from "@/connection/genkit";

import { useState } from "react";
export default function Assistente() {
  const [message, setMessage] = useState("");
  return (
    <>
      <div className="bg-[#1A202C] p-4 rounded-lg  flex flex-col items-center justify-center px-4 py-4">
        <h1 className="text-3xl text-white font-bold mb-4">Assistente de IA</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          const message = e.target.message.value;
          if (message) {
            ai(message).then((resp) => setMessage(resp));
          } else {
            alert("Por favor, preencha a mensagem");
          }
          e.target.restet();
        }}>
          <label htmlFor="message" className="text-white font-bold mb-2">Mensagem:</label>
          <textarea
            id="message"
            name="message"
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
            rows="5"
          />
          <label htmlFor="response" className="text-white font-bold mt-4">Resposta: </label>
          <textarea
            id="response"
            name="response"
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
            rows="5"
            value={message}
            readOnly
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4">Enviar</button>
        </form>
      </div>
    </>
  );
}