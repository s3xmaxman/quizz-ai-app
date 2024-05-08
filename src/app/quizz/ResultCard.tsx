import React from 'react'
import { cn } from '@/lib/utils'
import { clsx } from 'clsx'

type Props = {
    isCorrect: boolean | null | undefined,
    correctAnswer: string,
}

const ResultCard = (props: Props) => {
  const { isCorrect } = props  

  if (isCorrect === null || isCorrect === undefined) {
    return null
  }

  const text = isCorrect ? "正解です！" : "不正解です、 正解は" + props.correctAnswer

  const borderClasses = clsx({
    'border-green-500': isCorrect,
    'border-red-500': !isCorrect
  })

  return (
    <div className={cn(
        borderClasses,
        "border-2",
        "rounded-lg",
        "p-4",
        "text-center",
        "text-lg",
        "font-semibold",
        "my-4",
        "bg-secondary"
      )}
    >
    {text}
    </div>
  )
}

export default ResultCard