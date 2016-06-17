if (window.addEventListener) {
    window.addEventListener('load', function () {
            var canvas, context, canvaso, contexto;

            var tool;
            var tool_default = 'line';

            function init() {
                canvaso = document.getElementById('imageView');
                if (!canvaso) {
                    alert('Error: I cannot find the canvas element!');
                    return;
                }

                if (!canvaso.getContext) {
                    alert('Error: no canvas.getContext!');
                    return;
                }

                contexto = canvaso.getContext('2d');
                if (!contexto) {
                    alert('Error: failed to getContext!');
                    return;
                }

                var container = canvaso.parentNode;
                canvas = document.createElement('canvas');
                if (!canvas) {
                    alert('Error: I cannot create a new canvas element!');
                    return;
                }

                canvas.id = 'imageTemp';
                canvas.width = canvaso.width;
                canvas.height = canvaso.height;
                container.appendChild(canvas);

                context = canvas.getContext('2d');

                var tool_select = document.getElementById('dtool');
                if (!tool_select) {
                    alert('Error: failed to get the dtool element!');
                    return;
                }
                tool_select.addEventListener('change', ev_tool_change, false);

                if (tools[tool_default]) {
                    tool = new tools[tool_default]();
                    tool_select.value = tool_default;
                }

                canvas.addEventListener('mousedown', ev_canvas, false);
                canvas.addEventListener('mousemove', ev_canvas, false);
                canvas.addEventListener('mouseup', ev_canvas, false);
            }

            function ev_canvas(ev) {
                if (ev.layerX || ev.layerX == 0) { // Firefox
                    ev._x = ev.layerX;
                    ev._y = ev.layerY;
                } else if (ev.offsetX || ev.offsetX == 0) { // Opera
                    ev._x = ev.offsetX;
                    ev._y = ev.offsetY;
                }

                var func = tool[ev.type];
                if (func) {
                    func(ev);
                }
            }

            function ev_tool_change(ev) {
                if (tools[this.value]) {
                    tool = new tools[this.value]();
                }
            }

            function img_update() {
                contexto.drawImage(canvas, 0, 0);
                context.clearRect(0, 0, canvas.width, canvas.height);
            }

            var tools = {};

            tools.rect = function () {
                var tool = this;
                this.started = false;

                this.mousedown = function (ev) {
                    tool.started = true;
                    tool.x0 = ev._x;
                    tool.y0 = ev._y;
                };

                this.mousemove = function (ev) {
                    if (!tool.started) {
                        return;
                    }

                    var x = Math.min(ev._x, tool.x0),
                        y = Math.min(ev._y, tool.y0),
                        w = Math.abs(ev._x - tool.x0),
                        h = Math.abs(ev._y - tool.y0);

                    context.clearRect(0, 0, canvas.width, canvas.height);

                    if (!w || !h) {
                        return;
                    }

                    var grd = context.createLinearGradient(0, 0, w + x, 0);
                    grd.addColorStop(0, document.getElementById("fillColor1").value);
                    grd.addColorStop(1, document.getElementById("fillColor2").value);
                    context.fillStyle = grd;
                    context.fillRect(x, y, w, h);
                    context.strokeStyle = document.getElementById("strokeColor").value;
                    context.strokeRect(x, y, w, h);
                };

                this.mouseup = function (ev) {
                    if (tool.started) {
                        tool.mousemove(ev);
                        tool.started = false;
                        img_update();
                    }
                };
            };

            tools.circ = function () {
                var tool = this;
                this.started = false;

                this.mousedown = function (ev) {
                    tool.started = true;
                    tool.x0 = ev._x;
                    tool.y0 = ev._y;
                };

                this.mousemove = function (ev) {
                    if (!tool.started) {
                        return;
                    }
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    var grd = context.createLinearGradient(0, 0, 500, 0);
                    grd.addColorStop(0, document.getElementById("fillColor1").value);
                    grd.addColorStop(1, document.getElementById("fillColor2").value);
                    context.fillStyle = grd;
                    context.beginPath();
                    var distance = Math.sqrt(Math.pow(tool.x0 - ev._x, 2) + Math.pow(tool.y0 - ev._y, 2));

                    context.strokeStyle = document.getElementById("strokeColor").value;
                    context.arc(tool.x0, tool.y0, distance, 0, Math.PI * 2, false);
                    context.stroke();
                    context.closePath();
                    context.fill();
                };

                this.mouseup = function (ev) {
                    if (tool.started) {
                        tool.mousemove(ev);
                        tool.started = false;
                        img_update();
                    }
                };
            }

            tools.line = function () {
                var tool = this;
                this.started = false;

                this.mousedown = function (ev) {
                    tool.started = true;
                    tool.x0 = ev._x;
                    tool.y0 = ev._y;
                };

                this.mousemove = function (ev) {
                    if (!tool.started) {
                        return;
                    }
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.beginPath();
                    context.moveTo(tool.x0, tool.y0);
                    context.lineTo(ev._x, ev._y);
                    context.strokeStyle = document.getElementById("strokeColor").value;
                    context.stroke();
                    context.closePath();
                };

                this.mouseup = function (ev) {
                    if (tool.started) {
                        tool.mousemove(ev);
                        tool.started = false;
                        img_update();
                    }
                };
            };

            tools.text = function () {
                var tool = this;
                this.started = false;

                this.mousedown = function (ev) {
                    tool.started = true;
                    tool.x0 = ev._x;
                    tool.y0 = ev._y;
                };

                this.mousemove = function (ev) {
                    if (!tool.started) {
                        return;
                    }
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.beginPath();
                    context.font = "30px Arial";
                    context.fillText(document.getElementById("text").value, ev.x, ev.y);
                    context.fillStyle = document.getElementById("fillColor1").value;
                    context.stroke();
                    context.closePath();
                };

                this.mouseup = function (ev) {
                    if (tool.started) {
                        tool.mousemove(ev);
                        tool.started = false;
                        img_update();
                    }
                };
            };

            init();

        }, false
    )
    ;
}

