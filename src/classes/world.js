class World
{
    constructor()
    {
        this.fonts = {
            "default": loadFont("media/fonts/opensans.ttf"),
        };

        this.shaders = {
            "sea": loadShader("media/shaders/sea.vert", "media/shaders/sea.frag"),
        };

        
    }

    setup()
    {
        textFont(this.fonts["default"]);
    }

    update()
    {

    }

    render()
    {
        this.renderSea();
    }

    renderSea()
    {
        push();
        gl.disable(gl.DEPTH_TEST);
        let seaShader = this.shaders["sea"];
        seaShader.setUniform("u_Resolution", [width, height]);
        seaShader.setUniform("u_Time", millis() / 1000);
        shader(seaShader);
        rect(0, 0, width, height);
        resetShader();
        gl.enable(gl.DEPTH_TEST);
        pop();
    }
};