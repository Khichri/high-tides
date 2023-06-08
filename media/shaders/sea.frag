#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_Resolution;
uniform vec2 u_Offset;
uniform float u_Time;


void main() 
{
    vec2 something = u_Offset / u_Resolution;
    something.x = 1.0 - something.x;
    vec2 uv = 2.5 * gl_FragCoord.xy / u_Resolution - something;

    uv = floor(uv * 25.0) / 25.0;

    vec4 texture_color = vec4(0.192156862745098, 0.6627450980392157, 0.9333333333333333, 1.0);
    
    vec4 k = vec4(u_Time) * 0.8;
	k.xy = uv * 7.0;
    float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
    float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));
    float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
    vec4 color = vec4 ( pow(min(min(val1,val2),val3), 7.0) * 3.0)+texture_color;
    gl_FragColor = color;
    //gl_FragColor = vec4(u_Offset.x, 0, 0, 1);
}