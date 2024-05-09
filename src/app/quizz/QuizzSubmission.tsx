import Bar from '@/components/Bar'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useReward } from 'react-rewards'

type Props = {
    scorePercentage: number,
    score: number,
    totalQuestions: number
}

const QuizzSubmission = (props: Props) => {
  const {scorePercentage, score, totalQuestions} = props
  const { reward } = useReward('rewardId', 'confetti')
  const router = useRouter()

  useEffect(() => {
    if(scorePercentage === 100) {
      reward()
    }
  }, [scorePercentage, reward])

  const onHandleBack = () => {
    router.back()
  }
  
  return (
    <div className='flex flex-col flex-1'>
        <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
        <header className="flex items-center justify-end py-2 gap-2">
          <Button onClick={onHandleBack} size="icon" variant="outline">
            <X />
          </Button>
        </header>
      </div>
        <main className='py-11 flex flex-col gap-4 items-center flex-1 mt-24'>
            <h2 className='text-3xl font-bold'>
              Quizzコンプリート!
            </h2>
            <p>
              {scorePercentage}%正解しました
            </p>
            {scorePercentage === 100 ?(
               <div className='flex flex-col items-center'>
                <p>おめでとう 🎉</p>
                <div className='flex justify-center'>
                    <Image
                        src="/images/owl-smiling.png"
                        alt='Smile Owl'
                        width={400}
                        height={400}
                        unoptimized={true}
                    />
                </div>
                 <span id='rewardId' />
               </div>
            ) : (
            <>  
                <div className='flex flex-row gap-8 mt-6'>
                    <Bar color="green" percentage={scorePercentage} />
                    <Bar color="red" percentage={100 - scorePercentage} />
                </div>
                <div className='flex flex-row gap-8'>
                    <p>{score} 正解</p>
                    <p>{totalQuestions - score} 不正解</p>
                </div>
            </>
            )}
        </main>
    </div>
  )
}

export default QuizzSubmission