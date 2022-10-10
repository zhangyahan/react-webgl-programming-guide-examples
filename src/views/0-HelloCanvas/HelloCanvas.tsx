import { useLayoutEffect, useRef } from 'react'

export default function HelloCanvas(): JSX.Element {
  const ref = useRef<HTMLCanvasElement>() as React.RefObject<HTMLCanvasElement>

  useLayoutEffect(() => {}, [])

  return (
    <div className="container">
      <canvas ref={ref}>
        Please use a browser that supports &quot;canvas&quot;
      </canvas>
    </div>
  )
}
