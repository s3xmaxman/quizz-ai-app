"use client"

import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

const UploadDoc = () => {
  const [document, setDocument] = useState<File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!document) {
      setError("Please upload the document first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", document as Blob);
    try {
      const res = await fetch("/api/quizz/generate", {
        method: "POST",
        body: formData
      });
      if (res.status === 200) {
        const data = await res.json();
        const quizzId = data.quizzId;

        router.push(`/quizz/${quizzId}`);
      }
    } catch (e) {
      console.log("error while generating", e);
    }
    setIsLoading(false);
  }

  return (
        <div className="w-full">
            {isLoading ? ( <p>Loading...</p> ) : (<form className="w-full" onSubmit={handleSubmit}>
              <label 
                htmlFor="document" 
                className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"
               >
                <div className="absolute inset-0 m-auto flex justify-center items-center">
                    {document && document?.name  ?  document.name :  "ここにドラッグしてください"}
                </div>
                <input 
                    type="file" 
                    id="document" 
                    className="relative block w-full h-full z-50 opacity-0" 
                    onChange={(e) => setDocument(e?.target?.files?.[0])}
                />
                </label>
                {error ? <p className="text-red-600">{error}</p> : null}
                <Button
                    type="submit"
                    size="lg"
                    className="mt-2"
                >
                    Quizzを作成する🪄
                </Button>
            </form>)}
        </div>
    )
}

export default UploadDoc