"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { SIZES, COLORS } from "../_mocks";

function Dogs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedColor = searchParams?.get("color") || "marrom";
  const selectedSize = searchParams?.get("size") || "md";
  const [nickname, setNickname] = useState(searchParams?.get("nickname") || "");
  const [ageDog, setAgeDog] = useState(searchParams?.get("age") || "");
  const [selectedBreed, setSelectedBreed] = useState(
    searchParams?.get("breed") || "",
  );
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(searchParams?.get("imgUrl") || "");

  const regex = /breeds\/(.+?)\//;
  const breedMatch = imageUrl ? imageUrl.match(regex) : null;
  const breedName = breedMatch ? breedMatch[1] : "";

  const addItem = async () => {
    console.log("entrou addItem");
    console.log("nick", nickname);
    console.log("age", ageDog);
    console.log("breed", selectedBreed);
    console.log("color", selectedColor);
    console.log("size", selectedSize);
    if (
      nickname !== "" &&
      ageDog !== "" &&
      selectedBreed !== "" &&
      selectedColor !== "" &&
      selectedSize !== ""
    ) {
      await addDoc(collection(db, "doglist"), {
        nickname: nickname,
        age: ageDog,
        color: selectedColor,
        breed: selectedBreed,
        size: selectedSize,
        imageUrl: imageUrl,
        createdAt: Date.now(),
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("data effect", data.message);

        setBreeds(Object.keys(data.message));
      } catch (error) {
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://dog.ceo/api/breed/${selectedBreed}/images/random`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setImageUrl(data.message);
      } catch (error) {
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    if (selectedBreed !== breedName) {
      fetchData();
    }
  }, [selectedBreed, breedName]);

  useEffect(() => {
    const url = `?breed=${selectedBreed}&imgUrl=${imageUrl}&color=${selectedColor}&size=${selectedSize}${nickname ? `&nickname=${nickname}` : ""}${ageDog ? `&age=${ageDog}` : ""}`;
    router.push(url);
  }, [
    selectedBreed,
    imageUrl,
    selectedColor,
    selectedSize,
    nickname,
    ageDog,
    router,
  ]);

  function toggleFlexDirection() {
    const container = document.getElementById("container");
    if (window.innerWidth <= 640) {
      container?.classList.remove("flex-row");
      container?.classList.add("flex-col");
    } else {
      container?.classList.remove("flex-col");
      container?.classList.add("flex-row");
    }
  }

  window.addEventListener("load", toggleFlexDirection);
  window.addEventListener("resize", toggleFlexDirection);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center">
      <Suspense>
        <Card>
          <CardHeader>
            <Link href="/list" className="mt-8 underline">
              Ir para lista
            </Link>
            <CardTitle>Selecione uma raça:</CardTitle>
            <select
              className=" mb-6 text-black "
              value={selectedBreed}
              onChange={(e) => {
                setSelectedBreed(e.target.value);
              }}
            >
              <option>Selecione uma raça</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent>
            <div id="container" className="flex flex-row bg-white ">
              <div className=" bg-green flex min-w-64 justify-center ">
                {imageUrl ? (
                  <img src={imageUrl} alt="Dogs" width={250} height={150} />
                ) : (
                  <img src={"/logo.png"} alt="Dogs" width={150} height={150} />
                )}
              </div>
              <div className=" flex flex-row gap-10 p-4 ">
                <section className=" mb-5">
                  <h2 className="text-md mb-2 uppercase text-black">Cor:</h2>
                  <div className="flex flex-col gap-2">
                    {COLORS.map((color, index) => (
                      <Link
                        href={`?breed=${selectedBreed}&imgUrl=${imageUrl}&color=${color}&size=${selectedSize}${nickname ? `&nickname=${nickname}` : ""}${ageDog ? `&age=${ageDog}` : ""}`}
                        key={index}
                        className={`max-w-64 rounded-full border-2 bg-gray-100 px-2 py-1 text-center text-black ${selectedColor === color ? "border-blue-500" : "border-gray-200"}`}
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </Link>
                    ))}
                  </div>
                </section>
                <section className="mb-5">
                  <h2 className="text-md mb-2 uppercase text-black">
                    Tamanho:
                  </h2>
                  <div className="flex flex-col gap-2">
                    {SIZES.map((size, index) => (
                      <Link
                        href={`?breed=${selectedBreed}&imgUrl=${imageUrl}&color=${selectedColor}&size=${size}${nickname ? `&nickname=${nickname}` : ""}${ageDog ? `&age=${ageDog}` : ""}`}
                        key={index}
                        className={` max-w-64 items-center rounded-full border-2 bg-gray-100 px-4 py-1 text-center text-black ${selectedSize === size ? "border-blue-500" : "border-gray-200"}`}
                      >
                        {size.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>
            <div className="items-center gap-2 ">
              <p className="wb uppercase text-black">Apelido:</p>
              <input
                className="p-2 text-black "
                type="text"
                placeholder="Digite o apelido..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <p className="uppercase text-black">Idade:</p>
              <input
                title="Idade"
                className="p-2 text-black "
                type="text"
                placeholder="Digite a idade"
                value={ageDog}
                onChange={(e) => setAgeDog(e.target.value)}
              />
            </div>
            <button
              className="ml-8 w-16 border-l-2 border-slate-900 p-4 hover:bg-slate-900"
              onClick={addItem}
            >
              Adicionar
            </button>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}

export default Dogs;
