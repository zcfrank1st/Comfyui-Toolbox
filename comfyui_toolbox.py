import json

class TestJson:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text": ("STRING", {"multiline": True}),
            },
        }

    RETURN_TYPES = ("JSON",)
    FUNCTION = "json_test"
    CATEGORY = "test"

    def json_test(self, text):
        return (text, )

class PreviewJson:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "json_content": ("JSON",),
            },
        }

    RETURN_TYPES = ()
    FUNCTION = "json_preview"
    OUTPUT_NODE = True
    CATEGORY = "toolbox"

    def json_preview(self, json_content):
        pretty_json = json.dumps(json_content, indent=4)
        return { "ui": { "json_content": pretty_json }}

# class SaveJson:
#     ...

# class PreviewVideo:
#     ...

NODE_CLASS_MAPPINGS = {
    "PreviewJson": PreviewJson,
    #"SaveJson": SaveJson,
    #"PreviewVideo": PreviewVideo
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "PreviewJson": "Preview Json",
    #"SaveJson": "Save Json",
    #"PreviewVideo": "Preview Video"
}

WEB_DIRECTORY = "web"