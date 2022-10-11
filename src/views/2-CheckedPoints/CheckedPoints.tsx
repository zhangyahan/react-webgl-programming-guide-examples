import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import WebGLUtils from '@/utils/WebGLUtils'

const vertexShanderCode = /* glsl */`
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;  
}
`

const fragmentShanderCode = /* glsl */`
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`

export default function CheckedPoints(): JSX.Element {
  // canvas 对象
  const ref = useRef<HTMLCanvasElement>() as React.RefObject<HTMLCanvasElement>
  const [gl, setGL] = useState<WebGLRenderingContext>()
  const [program, setProgram] = useState<WebGLProgram>()
  const [points, updatePoints] = useState<{ x: number; y: number; z: number }[]>([])

  // 画布的点击事件
  const onClickDraw = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    evt.stopPropagation()

    if (!gl || !program)
      return

    // 计算点位的坐标信息
    let x = evt.clientX // 鼠标点击的坐标, 相对于整个窗口
    let y = evt.clientY // 鼠标点击的坐标, 相对于整个窗口
    const canvas = evt.target as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect() // 当前容器在父容器中的位置
    x = (x - rect.left) // 得出鼠标点击在 canvas 元素上的位置
    y = (y - rect.top) // 得出鼠标点击在 canvas 元素上的位置

    // 最终需要将坐标数据进行归一化, 因为 WebGL 坐标范围在 -1, 1 之间
    // y 归一化的差异为, y 坐标上为 1 下为 -1, 所以需要将容器高度减去
    // 点击的坐标位置, x 坐标为左为 1 右为 -1, 恰好和计算出来的符合.
    x = (x - canvas.width / 2) / (canvas.width / 2)
    y = (canvas.height / 2 - y) / (canvas.height / 2)

    updatePoints((points) => {
      const _points = points.concat([]) // 不能将原对象返回, 否则会造成数据更新延迟的问题.
      _points.push({ x, y, z: 0.0 })
      return _points
    })
  }

  // 异步的方法, 监听 points 的数据变化并进行操作.
  useEffect(() => {
    if (!gl || !program)
      return

    // 指定清除的背景色颜色, 如果不更新清除的背景色颜色, 无需进行调用.
    // gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清除背景颜色, 必须在每次绘制前进行清除背景, 否则将会造成之前的数据
    // 无法清除有渲染了新的数据导致了数据的重复渲染.
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 获取着色器内部变量位置
    const a_Position = gl.getAttribLocation(program, 'a_Position')
    points.forEach((point) => {
      gl.vertexAttrib3f(a_Position, point.x, point.y, point.z)
      // 绘制数据
      gl.drawArrays(gl.POINTS, 0, 1)
    })
  }, [points])

  // 与 useEffect 的区别为, 此方法在 HTML 元素挂载完成后
  useLayoutEffect(() => {
    if (ref.current) {
      const canvas = ref.current
      const gl = WebGLUtils.getWebGLContext(canvas)
      if (!gl) {
        console.log('getWebGLContext error')
        return
      }
      setGL(gl)

      // 加载着色器代码
      const program = WebGLUtils.initShader(gl, vertexShanderCode, fragmentShanderCode)
      if (!program) {
        console.log('initShander error')
        return
      }
      setProgram(program)

      // 指定清除的背景色颜色
      gl.clearColor(0.0, 0.0, 0.0, 1.0)

      // 清除背景颜色
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
  }, [])

  return (
    <div className="container">
      <canvas ref={ref} width={'400'} height={'400'} onClick={onClickDraw}></canvas>
    </div>
  )
}
