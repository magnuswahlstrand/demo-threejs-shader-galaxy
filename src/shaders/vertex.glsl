uniform float uTime;
uniform float uSize;
uniform vec2 uCursor;

attribute vec3 aRandomness;
attribute float aScale;

varying vec3 vColor;
varying float distanceToCenter;

void main()
{
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Rotate
    float angle = atan(modelPosition.x, modelPosition.z);
    distanceToCenter = length(modelPosition.xz);
    float distanceToCursor = distance(modelPosition.xz, uCursor);
    float angleOffset = (1.0 / distanceToCenter) * uTime;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
//    modelPosition.y += 0.045*(1.0-step(0.25, distanceToCenter))/distanceToCenter;
//    modelPosition.y -= 0.2*(1.0-step(0.50, distanceToCenter))*pow(cos(distanceToCenter),2.0);
    modelPosition.y -= 1.0-step(0.4, distanceToCursor);

    // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
     * Size
     */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    /**
     * Color
     */
    vColor = color;
}
