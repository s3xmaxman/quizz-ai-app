import React from 'react'
import { db } from "@/db";
import { eq } from 'drizzle-orm';
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";

import getUserMetrics from '@/app/actions/getUserMetrics';
import QuizzesTable, { Quizz} from './QuizzesTable';
import MetricCard from './MetricCard';
import getHeatMapData from '@/app/actions/getHeatMapData';
import SubmissionHeatMap from './HeatMap';
import SubscribeBtn from '../billing/SubscribeBtn';
import { PRICE_ID } from '@/lib/utils';


type Props = {}

const dashboard = async (props: Props) => {
  const session = await auth();
  const userId = session?.user?.id;
  const userData = await getUserMetrics();
  const heatMapData = await getHeatMapData();



  
  if(!userId) {
    return (
        <p>User not found</p>
    )
  }

  const userQuizzes: Quizz[] = await db.query.quizzes.findMany({
      where: eq(quizzes.userId, userId),
  })

//   console.log(userQuizzes)
    


 
  return (
        <>
        <div className='mt-4'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
            {userData && userData.length > 0 ? (
                userData.map((metric) => (
                <MetricCard 
                    key={metric.label} 
                    label={metric.label} 
                    value={metric.value} 
                />
                ))
            ) : null}
            </div>
          </div>
          { heatMapData ? <SubmissionHeatMap data={heatMapData.data} /> : null }
          <SubscribeBtn userId={userId} price={PRICE_ID} />
          <QuizzesTable quizzes={userQuizzes} />
        </>
  )
 
}

export default dashboard