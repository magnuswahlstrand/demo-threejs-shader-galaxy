attribute float aScale;
uniform float uTime;
uniform float uSize;
varying vec2 vUv;
varying vec3 vColor;

void main()
{
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float angle = atan(modelPosition.x, modelPosition.z);
    float dist = length(modelPosition.xz);

    float angleOffset = (1.0/dist) * uTime * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * dist;
    modelPosition.z = sin(angle) * dist;
    //    angle += uTime;
    //    viewPosition.x += uTime;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    /**
     * Size
     */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = color;
}
