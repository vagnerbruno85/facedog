"use client";

import Header from "../_components/header";
import Footer from "../_components/footer";
import Dogs from "../_components/dogs";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <head>
        <title> Home | FaceDog</title>
        <link rel="icon" href="./dog-icon.png" />
      </head>

      <main className="mx-auto flex flex-col px-4 py-8">
        <Header />
        <Suspense>
          <Dogs />
        </Suspense>
        <Footer />
      </main>
    </>
  );
}
