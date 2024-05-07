import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex justify-center flex-1">
        <h1 className="text-6xl font-bold">Hello World👋</h1>
      </main>
      <footer>
        <Button>Start</Button>
      </footer>
    </div>
  )
}
