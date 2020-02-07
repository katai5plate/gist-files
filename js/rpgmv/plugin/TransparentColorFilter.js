// RPGツクール2000風に透過色を指定して透明にする。
// @pixi/filter-color-replace をアレンジ。

function TransparentColorFilter(color) {
  /*!
   * @pixi/filter-color-replace - v3.0.3
   * Compiled Fri, 07 Feb 2020 21:26:48 UTC
   *
   * @pixi/filter-color-replace is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var vertexShader = [
      'attribute vec2 aVertexPosition;',
      'attribute vec2 aTextureCoord;',
      'uniform mat3 projectionMatrix;',
      'varying vec2 vTextureCoord;',
      'void main(void) {',
      '    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
      '    vTextureCoord = aTextureCoord;',
      '}'
  ].join('\n');
  var fragmentShader = [
      'varying vec2 vTextureCoord;',
      'uniform sampler2D uSampler;',
      'uniform vec3 originalColor;',
      'void main(void) {',
      '    vec4 currentColor = texture2D(uSampler, vTextureCoord);',
      '    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));',
      '    float doReplace = step(length(colorDiff), 0.0);',
      '    gl_FragColor = vec4(mix(currentColor.rgb, vec3(0, 0, 0), doReplace), mix(currentColor.a, 0.0, doReplace));',
      '}'
  ].join('\n');
  PIXI.Filter.call(this, vertexShader, fragmentShader);
  var f32a = new Float32Array(3);
  if (typeof color === 'number') {
      PIXI.utils.hex2rgb(color, f32a);
  } else {
      var div = Math.max(color[0], color[1], color[2]) > 1 ? 255 : 1;
      f32a[0] = color[0] / div;
      f32a[1] = color[1] / div;
      f32a[2] = color[2] / div;
  }
  this.uniforms.originalColor = f32a;
}
TransparentColorFilter.prototype = Object.create(PIXI.Filter.prototype);
TransparentColorFilter.prototype.constructor = TransparentColorFilter;
