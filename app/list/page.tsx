"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { db } from "../firebase";

interface IDogList {
  id?: string;
  age: string;
  breed: string;
  color: string;
  imageUrl: string;
  nickname: string;
  size: string;
}

export default function List() {
  const [items, setItems] = useState<IDogList[]>([]);
  const [loading, setLoading] = useState(false);

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "doglist", id));
  };

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "doglist"));
    onSnapshot(q, (querySnapshot) => {
      let itemsArr: IDogList[] = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text p-4 text-center text-4xl">FaceDog List</h1>
        <div className="rounded-lg bg-slate-800 p-4">
          {/* <form className="grid grid-cols-6 items-center text-black">
            <input
              className="col-span-3 border p-3"
              type="text"
              placeholder="Digite o nome"
            />

            <input
              className="max-3 col-span-2 border p-3"
              type="number"
              placeholder="Digite a Idade"
            />

            <button
              className="bg-slate-950 p-3 text-xl text-white hover:bg-slate-900"
              type="submit"
            >
              +
            </button>
          </form> */}
          <Suspense>
            <>
              <ul>
                {items.map((item, id) => (
                  <li
                    key={id + item.nickname}
                    className="my-4w-full flex justify-between bg-slate-950 "
                  >
                    <div className="flex w-full items-center justify-between p-4">
                      <Image
                        src={item.imageUrl}
                        width={50}
                        height={50}
                        alt={"Imagem do cachorro"}
                      />

                      <span className="capitalize">{item.nickname}</span>
                      <span>{item.breed}</span>
                      <span>{item.color}</span>
                      <span>{item.age}</span>
                      <span>{item.size}</span>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="ml-8 w-16 border-l-2 border-slate-900 p-4 text-red-600 hover:bg-slate-900"
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p>{items.length} listados</p>
            </>
          </Suspense>
          <Link href="/" className="mt-8 underline">
            Ir para Página Inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
