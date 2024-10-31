import Footer from "@/app/components/ui/Footer";
import Feed from "@/app/components/ui/Feed";
import Profile from "@/app/components/ui/Profile";
import Roll from "@/app/components/ui/Roll"


export default function Home() {
  return (
    <div>
      <main className="flex flex-col min-h-screen">
          <div className="grid grid-cols-4 flex-grow">
          <div className="left-element col-span-1 space-y-1"><Profile></Profile></div>
          <div className="right-element col-span-3 text-left space-y-3"><Feed></Feed></div>
          <Footer></Footer>          
        </div>
      </main>
    </div>
  );
}
