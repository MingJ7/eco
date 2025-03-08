export default function CatHeaders() {
    return <div className="sticky flex top-0 items-center w-full bg-black justify-start">
          <a href="#mains" className="flex-1 bottom-0 hover:bg-yellow-100 text-sm md:text-lg font-extrabold border-2 border-black rounded-lg m-0 py-3 md:py-4 px-3 md:px-4 text-blue-600 bg-red-200"> 
            <span className="">Mains</span>
          </a>
          <a href="#meat" className="flex-1 bottom-0 hover:bg-yellow-100 text-sm md:text-lg font-extrabold border-2 border-black rounded-lg m-0 py-3 md:py-4 px-3 md:px-4 text-blue-600 bg-red-200"> 
            <span className="">Meat</span>
          </a>
          <a href="#fish" className="flex-1 bottom-0 hover:bg-yellow-100 text-sm md:text-lg font-extrabold border-2 border-black rounded-lg m-0 py-3 md:py-4 px-3 md:px-4 text-blue-600 bg-red-200">
            <span className="">Fish</span>
          </a>
          <a href="#veg" className="flex-1 bottom-0 hover:bg-yellow-100 text-sm md:text-lg font-extrabold border-2 border-black rounded-lg m-0 py-3 md:py-4 px-3 md:px-4 text-blue-600 bg-red-200">
            <span className="">Veg</span>
          </a>
          <a href="#other" className="flex-1 bottom-0 hover:bg-yellow-100 text-sm md:text-lg font-extrabold border-2 border-black rounded-lg m-0 py-3 md:py-4 px-3 md:px-4 text-blue-600 bg-red-200">
            <span className="">Other</span>
          </a>
    </div>
}