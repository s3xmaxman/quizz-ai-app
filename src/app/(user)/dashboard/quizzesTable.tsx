import { quizzes } from "@/db/schema";
import { table } from "console";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";

export type Quizz = InferSelectModel<typeof quizzes>;

type Props = {
  quizzes: Quizz[];
};

const QuizzesTable = ({ quizzes }: Props) => {
  return (
    <div className="rounded-md overflow-hidden p-5 border">
      <table className="table-auto">
        <thead>
          <tr>
            <th className="text-[#6c7381] text-left">お題</th>
            <th className="text-[#6c7381] text-left px-4">説明</th> {/* Added padding */}
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quizz: Quizz) => (
            <tr key={quizz.id}>
              <td>
                <Link href={`/quizz/${quizz.id}`}>
                  <p className="text-blue-600 underline">
                    {quizz.name}
                  </p>
                </Link>
              </td>
              <td className="pl-4">
                {quizz.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizzesTable;