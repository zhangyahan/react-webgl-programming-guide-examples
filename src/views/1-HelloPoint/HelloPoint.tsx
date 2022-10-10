import React, { useLayoutEffect, useRef } from 'react'
import vertexShaderText from './shader.vertex.glsl?raw'
import fragmentShaderText from './shader.fragment.glsl?raw'
import WebGLUtils from '@/utils/WebGLUtils'

export default function HelloPoint(): JSX.Element {
  const ref = useRef<HTMLCanvasElement>() as React.RefObject<HTMLCanvasElement>

  useLayoutEffect(() => {
    if (!ref.current)
      return

    const gl = WebGLUtils.getWebGLContext(ref.current)
    if (!gl) {
      console.log('创建 WebGL 上下文失败.')
      return
    }

    const program = WebGLUtils.initShader(gl, vertexShaderText, fragmentShaderText)
    if (!program) {
      console.log('初始化着色器失败')
      return
    }

    // FIXME: 点位被拉伸
    const a_Position = gl.getAttribLocation(program, 'a_Position')
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    // 指定清除画布的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清除画布
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1)
  }, [])

  return (
    <div className="container">
    <canvas ref={ref} width={'400'} height={'400'}>
      Please use a browser that supports &quot;canvas&quot;
    </canvas>
  </div>
  )
}
