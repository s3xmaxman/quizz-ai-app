import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";


const page = () => {
    return (
        <Alert variant={"default"}>
            <AlertTitle className="mb-3 text-xl text-green-400">
                Success
            </AlertTitle>
            <AlertDescription>
                お支払いが完了しました.
                <br />
                <Link href="/dashboard" className="underline">ダッシュボード</Link> へ戻ってQuizzを作成してみましょう.
            </AlertDescription>
        </Alert>
    )
}

export default page