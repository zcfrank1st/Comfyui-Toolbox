import { app } from "../../../scripts/app.js";
import { $el } from "../../../scripts/ui.js";

function get_position_style(ctx, widget_width, y, node_height) {
    const MARGIN = 4;  // the margin around the html element

/* Create a transform that deals with all the scrolling and zooming */
    const elRect = ctx.canvas.getBoundingClientRect();
    const transform = new DOMMatrix()
        .scaleSelf(elRect.width / ctx.canvas.width, elRect.height / ctx.canvas.height)
        .multiplySelf(ctx.getTransform())
        .translateSelf(MARGIN, MARGIN + y);

    return {
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
	// Unique name for the extension
	name: "Comfyui.ToolboxExtension",
	async init(app) {
		// Any initial setup to run as soon as the page loads
	},
	async setup(app) {
		// Any setup to run after the app is created
	},
	async addCustomNodeDefs(defs, app) {
		// Add custom node definitions
		// These definitions will be configured and registered automatically
	},
	async getCustomWidgets(app) {
		// Return custom widget types
		// See ComfyWidgets for widget examples
		// console.log("[logging]", "provide custom widgets");

		// return {
			// JSON(node, inputName, inputData, app) {
			    // const inputEl = document.createElement("code");
				// inputEl.className = "comfy-json-preview";
				// inputEl.value = inputData[1];

				// const widget = node.addDOMWidget(inputName, "json", inputEl, {
				// 	getValue() {
				// 		return inputEl.value;
				// 	},
				// 	setValue(v) {
				// 		inputEl.value = v;
				// 	},
				// });
				// widget.inputEl = inputEl;

				// return { minWidth: 400, minHeight: 400, widget };

				// TODO add link and preview code
				// const defaultVal = inputData[1] || "";
				// return { widget: node.addWidget("json", inputName, defaultVal, () => {}, {}) };
			// } 
		// }
	},
	
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		// Run custom logic before a node definition is registered with the graph
		if (nodeType.comfyClass === "PreviewJson") { // 3
			const onExecuted = nodeType.prototype.onExecuted;                     // 4
			nodeType.prototype.onExecuted = function (message) {
				onExecuted?.apply(this, arguments);	
				
				const widget = {
                    type: "HTML",   // whatever
                    name: "code", // whatever
                    draw(ctx, node, widget_width, y, widget_height) { 
                        Object.assign(this.inputEl.style, get_position_style(ctx, widget_width, y, node.size[1]));
                    },
                };

                /*
                Create an html element and add it to the document.  
                Look at $el in ui.js for all the options here
                */
                widget.inputEl = $el("code", { value: message.json_file.join("") });
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
	async registerCustomNodes(app) {
		// Register any custom node implementations here allowing for more flexability than a custom node def
	},
	loadedGraphNode(node, app) {
		// Fires for each node when loading/dragging/etc a workflow json or png
		// If you break something in the backend and want to patch workflows in the frontend
	},
	nodeCreated(node, app) {
		// Fires every time a node is constructed
		// You can modify widgets/add handlers/etc here
	}
};

app.registerExtension(ext);
