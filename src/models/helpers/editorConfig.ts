export class projectDetailEditorConfig{
    projectDetail:editorConfig;
    projectRequirement:editorConfig;
    projectFlow:editorConfig[];
}

export class editorConfig
{
    ckfinder:{
        uploadUrl:string;
        options: {
          resourceType:string;
        }
    }
}