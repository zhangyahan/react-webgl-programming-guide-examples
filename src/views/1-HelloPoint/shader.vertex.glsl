attribute vec4 a_Position;

void main() {
  // gl_Position = vec4(0.0, 0.0, 0.0, 1.0); // 设置顶点坐标位置
  gl_Position = a_Position;
  gl_PointSize = 10.0; // 设置点的大小
}