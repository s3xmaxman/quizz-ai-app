import React from 'react'

type Props = {
    isCorrect: boolean | null,
    correctAnswer: string,
}

const ResultCard = (props: Props) => {
  const { isCorrect } = props  

  if (isCorrect === null) {
    return null
  }

  const text = isCorrect ? "正解です！" : "不正解です、 正解は" + props.correctAnswer

  return (
    <div>{text}</div>
  )
}

export default ResultCard