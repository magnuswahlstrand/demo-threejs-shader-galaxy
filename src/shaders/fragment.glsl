uniform float uTime;
uniform float uFreq;
uniform float uBorder;
uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;

varying vec2 vUv;
varying vec3 vColor;

void main()
{
//
//    // Disc
//    float strength = distance(gl_PointCoord, vec2(0.5));
//    strength = step(0.5, strength);
//    strength = 1.0 - strength;
//
//    gl_FragColor = vec4(vec3(strength), 1.0);

    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    gl_FragColor = vec4(strength*vColor, 1.0);
}
