import { app } from "/scripts/app.js";
import "/scripts/domWidget.js"
import {ComfyWidgets} from "/scripts/widgets.js"
import { api } from "/scripts/api.js";
import { $el } from "/scripts/ui.js";

function get_position_style(ctx, widget_width, y, node_height) {
    const MARGIN = 4;  // the margin around the html element

/* Create a transform that deals with all the scrolling and zooming */
    const elRect = ctx.canvas.getBoundingClientRect();
    const transform = new DOMMatrix()
        .scaleSelf(elRect.width / ctx.canvas.width, elRect.height / ctx.canvas.height)
        .multiplySelf(ctx.getTransform())
        .translateSelf(MARGIN, MARGIN + y);

    return {
        background: black,
        color: green,
        transformOrigin: '0 0',
        transform: transform,
        left: `0px`, 
        top: `0px`,
        position: "absolute",
        maxWidth: `${widget_width - MARGIN*2}px`,
        maxHeight: `${node_height - MARGIN*2}px`,    // we're assuming we have the whole height of the node
        width: `auto`,
        height: `auto`,
    }
}

const ext = {
	name: "Comfyui.ToolboxExtension",
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		if (nodeType.comfyClass === "PreviewJson" || nodeType.comfyClass === "SaveJson") { // 3
			const outSet = function (texts) {
				if (texts.json_file.length > 0) {
					let widget_id = this?.widgets.findIndex(
						(w) => w.type == "showjson" + nodeType.comfyClass
					);
					
					let currentWidget = this.widgets[widget_id]
					let request_api = async function () {

						let responseData = await api.fetchApi(
							`/toolbox/json/${texts.json_file.join("")}`,
							{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
							}
						);
						responseData = await responseData?.json();

						console.log(responseData)
						console.log(currentWidget)

						currentWidget.inputEl.innerHTML = responseData.content;

						console.log(currentWidget.value)
						app.graph.setDirtyCanvas(true);
					}

					request_api();
				}
			};

			// onExecuted
			const onExecuted = nodeType.prototype.onExecuted;
			nodeType.prototype.onExecuted = function (texts) {
				onExecuted?.apply(this, arguments);
				outSet.call(this, texts);
			};

			const orig_nodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                orig_nodeCreated?.apply(this, arguments);

                const widget = {
                    type: "showjson" + nodeType.comfyClass,   // whatever
                    name: "showjson", // whatever
                    draw(ctx, node, widget_width, y, widget_height) { 
                        Object.assign(this.inputEl.style, get_position_style(ctx, widget_width, y, node.size[1])); // assign the required style when we are drawn
                    },
                };

                /*
                Create an html element and add it to the document.  
                Look at $el in ui.js for all the options here
                */
                widget.inputEl = $el("code");
				widget.inputEl.innerHTML = "Output Json ..."
                document.body.appendChild(widget.inputEl);

                /*
                Add the widget, make sure we clean up nicely, and we do not want to be serialized!
                */
                this.addCustomWidget(widget);
                this.onRemoved = function () { widget.inputEl.remove(); };
                this.serialize_widgets = false;

            }
		}
	},
};

app.registerExtension(ext);
