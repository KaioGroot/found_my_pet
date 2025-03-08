import { Geist, Geist_Mono } from "next/font/google";


export default function Layout({ children }) {
  return (
    <>

      <div className="flex h-screen text-red">{children}</div>
    </>
  );
}