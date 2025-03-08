"use client"
import { useEffect, useState } from "react";

export default function UserVerify() {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return user;
}