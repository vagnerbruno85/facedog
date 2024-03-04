import Link from 'next/link';
import Image from 'next/image';

const NotFound = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <Image 
          src="/logo.png" 
          alt="Dog Book Logo" 
          className="w-32 h-auto mb-4" 
          width={108} 
          height={100} />
        <div className="text-center">
          <h4 className=" mb-4">Oops, não encontramos esta página!</h4>
          <span className="text-xl ">
            Click no link abaixo, para retorna a Página Inicial.
          </span>
        </div>
        <Link href="/" className="mt-8 underline">
          Ir para Página Inicial
        </Link>
      </div>
    </>
  );
};

export default NotFound;
