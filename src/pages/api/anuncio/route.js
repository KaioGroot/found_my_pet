"use client"

import fs from "fs";
import fsPath from "path";

const filePath = fsPath.join(process.cwd(), "src", "pages", "api", "anuncio", "db.json");
const data = fs.readFileSync(filePath, "utf-8");

export default async function handler(req, res) {

  if (req.method === "POST") {
    const { id, name, breed, age, weight, city, state, photo } = req.body;
    const pets = await JSON.parse(data);
    const newPet = {
      id: pets.length + 1,
      name: req.body.name,
      breed,
      age,
      weight,
      city,
      state,
      photo,
    }
    console.log(newPet);
    pets.push(newPet);
    fs.writeFileSync(filePath, JSON.stringify(pets, null, 2));
    res.status(200).json(newPet);
    return;
  } else if (req.method === "GET") {
    const pets = JSON.parse(data);
    res.status(200).json(pets);
  }

}
