uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;
uniform float uAudioFrequency;

attribute vec4 tangent;

varying float vWobble;
varying float vAudioFrequency;

#include ../includes/simplexNoise4d.glsl

float getWhobble(vec3 position) {
    vec3 warpedPosition = position + uTime;
    warpedPosition += simplexNoise4d(vec4(
        position * uWarpPositionFrequency,
        (uAudioFrequency / 70.0) * uWarpTimeFrequency
    )) * uWarpStrength * uAudioFrequency / 100.0;

    return simplexNoise4d(vec4(
        warpedPosition * uPositionFrequency,
        (uAudioFrequency / 70.0) * uTimeFrequency
    )) * uStrength * uAudioFrequency / 100.0;
}

void main() {
    vec3 biTangent = cross(normal, tangent.xyz);

    // Neighbours positions
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent.xyz * shift;

    // Wobble
    float wobble = getWhobble(csm_Position);
    csm_Position += wobble * normal;
    positionA += getWhobble(positionA) * normal;
    positionB += getWhobble(positionB) * normal;

    // Compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    // Varyings
    vWobble = wobble / uStrength;
    vAudioFrequency = uAudioFrequency;
}
