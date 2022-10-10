export default class WebGLUtils {
  private static GET_A_WEBGL_BROWSER = `
    浏览器不支持 WebGL, <a href="http://get.webgl.org">点击这里查看支持 WebGL 的浏览器列表.</a>
  `

  private static OTHER_PROBLEM = `
    WebGL 不能运行在你的浏览器上, '<a href="http://get.webgl.org">点击这里获取更多信息.</a>';
  `

  private static makeDebugContext(context: WebGLRenderingContext, onError: (error: Error, funcName: string, ...args: any[]) => void) {
    console.log(context, onError)
  }

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
   * @param debug
   */
  public static getWebGLContext(canvas: HTMLCanvasElement, debug = false): WebGLRenderingContext | null {
    const gl = this.setup(canvas)
    if (!gl)
      return null

    console.log(debug)

    // if (debug)
    //   gl = this.makeDebugContext(gl)

    return gl
  }
}
