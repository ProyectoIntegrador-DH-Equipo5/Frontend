import Button from './Button';

const Buscador = () => {
  return (
    <section className="mx-auto bg-primary p-7 flex-col justify-center items-center text-center w-full">
        <h1 className="text-3xl font-bold  mb-4 text-white">Busca un cuadro</h1>
        <form action="" className="flex justify-center gap-4 p-5 items-center">
        <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Busca por cuadro, autor o categoría"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
            <input type="date" className="w-full max-w-[15rem] rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-700 focus:outline-none" />
            <Button text={"Buscar"} bgColor="background" textColor="white" />
        </form>
    </section>
  )
}

export default Buscador
