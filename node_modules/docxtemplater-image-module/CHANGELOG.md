### unreleased (master branch)

-	Breaking : The image module no longer swallows error thrown by `options.getImage` and `options.getSize`. It is the implementors responsibility to not throw any errors, or the error will be passed. You can return a falsy value in getImage to not render an image at all.

### 3.0.2

-	Fix issue with PPTX : Before, you had to add to your options : {fileType: "pptx"} in the module options passed as argument in the constructor of the module. Now, the fileType is retrieved from the main docxtemplater.

### 3.0.1

-	Add support for PPTX.
-	Add centering of images with {%%image} syntax

### 3.0.0

-	This version is compatible with docxtemplater 3.0.
