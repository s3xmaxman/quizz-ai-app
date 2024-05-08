"use client"

import { Button } from "@/components/ui/button"
import React, { useState } from "react"

const UploadDoc = () => {
    const [document, setDocument] = useState<File | null | undefined>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
       
        if(!document) {
            setError("Please select a document")
            return
        }

        setIsLoading(true)

        const formData = new FormData()

        formData.append("pdf", document as Blob)

        try {
            
            const res = await fetch("/api/quizz/generate", {
                method: "POST",
                body: formData,
            })

            if(res.status === 200) {
                console.log("quizz generated successfully")
            }

        } catch (error) {
            console.log("error generating quizz", error)
        }

        setIsLoading(false)
    }

    return (
        <div className="w-full">
            <form className="w-full" onSubmit={handleSubmit}>
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
            </form>
        </div>
    )
}

export default UploadDoc