import React from 'react'

type Props = {
    value: number
}


const ProgressBar = ({ value }: Props) => {
  return (
    <div className='w-full bg-secondary rounded-full'>
        <div 
            className='bg-primary h-2.5 rounded-md'
            style={{width: `${value}%`}}
        >

        </div>
    </div>
  )
}

export default ProgressBar