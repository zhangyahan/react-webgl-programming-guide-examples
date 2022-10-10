import { useLayoutEffect, useRef } from 'react'
import WebGLUtils from '@/utils/WebGLUtils'

export default function HelloCanvas(): JSX.Element {
  const ref = useRef<HTMLCanvasElement>() as React.RefObject<HTMLCanvasElement>

  useLayoutEffect(() => {
    if (!ref.current)
      return
    // Get the rendering context for WebGL
    const gl = WebGLUtils.getWebGLContext(ref.current)
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL')
      return
    }

    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)
  }, [])

  return (
    <div className="container">
      <canvas ref={ref} width={'400'} height={'400'}>
        Please use a browser that supports &quot;canvas&quot;
      </canvas>
    </div>
  )
}
