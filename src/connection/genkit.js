"use server"
import { genkit } from "genkit";
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';

//genkit instance 
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash
})
export default async function genkitFlow(texto) {
  const { text } = await ai.generate(`${texto}`)
  return text
}