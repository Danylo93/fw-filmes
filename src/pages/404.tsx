import Header from "@/components/Header";

export default function Error404() {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        <div className="m-auto">
          <div className="-mt-20">
            <span className="text-xl font-light">404 | Contéudo não existe</span>
          </div>
        </div>
      </div>
    </>
  );
}
