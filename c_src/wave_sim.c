#include <emscripten.h>
#include <math.h>

EMSCRIPTEN_KEEPALIVE
void wave_sim(double* input, double* output, int size, double freq) {
    for(int i = 0; i < size; i++) {
        output[i] = sin(2 * M_PI * freq * input[i]);
    }
}