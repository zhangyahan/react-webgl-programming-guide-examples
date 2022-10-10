export default class WebGLUtils {
  private static GET_A_WEBGL_BROWSER = `
    浏览器不支持 WebGL, <a href="http://get.webgl.org">点击这里查看支持 WebGL 的浏览器列表.</a>
  `

  private static OTHER_PROBLEM = `
    WebGL 不能运行在你的浏览器上, '<a href="http://get.webgl.org">点击这里获取更多信息.</a>';
  `

  /**
   * 创建 3D 上下文
   * @param canvas
   * @param attributes
   * @returns {WebGLRenderingContext | null}
   */
  private static create3DContext(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): WebGLRenderingContext | null {
    const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl']
    let context = null
    for (let index = 0; index < names.length; index++) {
      const name = names[index]
      try {
        context = canvas.getContext(name, attributes) as WebGLRenderingContext
      }
      catch (ignore) { }

      if (context)
        break
    }
    return context
  }

  /**
   * 创建 WebGL 上下文
   * @param canvas
   * @param attributes
   * @param error
   */
  private static setup(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes, onError?: (message: string) => void): WebGLRenderingContext | null {
    const handleCreationError = (message: string) => {
      const container = document.getElementsByTagName('body')[0]
      if (container) {
        let str = window.WebGLRenderingContext ? this.OTHER_PROBLEM : this.GET_A_WEBGL_BROWSER
        if (message)
          str = `${str} <br/><br/>Status: ${message}`

        container.innerHTML = `
          <div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">${str}</div>
        `
      }
    }

    const handleError = onError || handleCreationError

    if (canvas.addEventListener) {
      canvas.addEventListener('webglcontextcreationerror', ((event: WebGLContextEvent) => {
        handleError(event.statusMessage)
      }) as EventListener)
    }

    const context = this.create3DContext(canvas, attributes)
    if (!context)
      handleError('')

    return context
  }

  /**
   * 初始化并获取 WebGL 上下文
   * @param canvas
   */
  public static getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
    const gl = this.setup(canvas)
    if (!gl)
      return null

    return gl
  }

  /**
   * 加载着色器
   * @param gl
   * @param type
   * @param source
   * @returns
   */
  private static loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader | null {
    // 创建着色器对象
    const shader = gl.createShader(type)
    if (shader === null) {
      console.log('无法创建着色器对象.')
      return null
    }

    // 设置着色器程序代码
    gl.shaderSource(shader, source)

    // 编译着色器
    gl.compileShader(shader)

    // 检查编译的返回值
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled) {
      const error = gl.getShaderInfoLog(shader)
      console.log(`编译着色器失败: ${error}`)
      return null
    }

    return shader
  }

  /**
   * 创建着色器程序代码
   * @param gl
   * @param vshader
   * @param fshader
   * @returns
   */
  private static createProgram(gl: WebGLRenderingContext, vshader: string, fshader: string): WebGLProgram | null {
    // 创建顶点着色器和片段着色器对象
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vshader)
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fshader)
    if (!vertexShader || !fragmentShader)
      return null

    // 创建程序对象
    const program = gl.createProgram()
    if (!program)
      return null

    // 关联着色器对象
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    // 链接程序对象
    gl.linkProgram(program)

    // 检查链接状态
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!linked) {
      const error = gl.getProgramInfoLog(program)
      console.log(`链接着色器程序失败: ${error}`)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      return null
    }

    return program
  }

  public static initShader(gl: WebGLRenderingContext, vshader: string, fshader: string): WebGLProgram | null {
    const program = this.createProgram(gl, vshader, fshader)

    if (!program) {
      console.log('创建着色器程序失败.')
      return null
    }

    gl.useProgram(program)

    return program
  }
}
