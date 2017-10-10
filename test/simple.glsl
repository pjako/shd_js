@vs vs
in vec4 position;
in vec4 color0;
uniform ColorBlock {
    float alpha;
    vec3 col;
};
out vec4 color;
void main() {
    gl_Position = position;
    color = vec4(col * color0.xyz, color.w * alpha);
}
@end

@fs fs
in vec4 color;
out vec4 fragColor;
void main() {
    fragColor = color;
}
@end

@program Shader vs fs
