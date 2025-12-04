uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {
    float textureAlpha = texture(uTexture, gl_PointCoord).r;

    gl_FragColor = vec4(uColor.rgb, textureAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
