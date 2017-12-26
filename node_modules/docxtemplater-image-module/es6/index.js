"use strict";

const templates = require("./templates");
const DocUtils = require("docxtemplater").DocUtils;
const DOMParser = require("xmldom").DOMParser;

function isNaN(number) {
	return !(number === number);
}

const ImgManager = require("./imgManager");
const moduleName = "open-xml-templating/docxtemplater-image-module";

function getInnerDocx({part}) {
	return part;
}

function getInnerPptx({part, left, right, postparsed}) {
	const xmlString = postparsed.slice(left + 1, right).reduce(function (concat, item) {
		return concat + item.value;
	}, "");
	const xmlDoc = new DOMParser().parseFromString("<xml>" + xmlString + "</xml>");
	const offset = xmlDoc.getElementsByTagName("a:off");
	const ext = xmlDoc.getElementsByTagName("a:ext");
	part.ext = {
		cx: parseInt(ext[0].getAttribute("cx"), 10),
		cy: parseInt(ext[0].getAttribute("cy"), 10),
	};
	part.offset = {
		x: parseInt(offset[0].getAttribute("x"), 10),
		y: parseInt(offset[0].getAttribute("y"), 10),
	};
	return part;
}

class ImageModule {
	constructor(options) {
		this.name = "ImageModule";
		this.options = options || {};
		this.imgManagers = {};
		if (this.options.centered == null) { this.options.centered = false; }
		if (this.options.getImage == null) { throw new Error("You should pass getImage"); }
		if (this.options.getSize == null) { throw new Error("You should pass getSize"); }
		this.imageNumber = 1;
	}
	optionsTransformer(options, docxtemplater) {
		const relsFiles = docxtemplater.zip.file(/\.xml\.rels/)
			.concat(docxtemplater.zip.file(/\[Content_Types\].xml/))
			.map((file) => file.name);
		this.fileTypeConfig = docxtemplater.fileTypeConfig;
		this.fileType = docxtemplater.fileType;
		this.zip = docxtemplater.zip;
		options.xmlFileNames = options.xmlFileNames.concat(relsFiles);
		return options;
	}
	set(options) {
		if (options.zip) {
			this.zip = options.zip;
		}
		if (options.xmlDocuments) {
			this.xmlDocuments = options.xmlDocuments;
		}
	}
	parse(placeHolderContent) {
		const module = moduleName;
		const type = "placeholder";
		if (placeHolderContent.substring(0, 2) === "%%") {
			return {type, value: placeHolderContent.substr(2), module, centered: true};
		}
		if (placeHolderContent.substring(0, 1) === "%") {
			return {type, value: placeHolderContent.substr(1), module, centered: false};
		}
		return null;
	}
	postparse(parsed) {
		let expandTo;
		let getInner;
		if (this.fileType === "pptx") {
			expandTo = "p:sp";
			getInner = getInnerPptx;
		}
		else {
			expandTo = this.options.centered ? "w:p" : "w:t";
			getInner = getInnerDocx;
		}
		return DocUtils.traits.expandToOne(parsed, {moduleName, getInner, expandTo});
	}
	render(part, options) {
		this.imgManagers[options.filePath] = this.imgManagers[options.filePath] || new ImgManager(this.zip, options.filePath, this.xmlDocuments, this.fileType);
		const imgManager = this.imgManagers[options.filePath];
		if (!part.type === "placeholder" || part.module !== moduleName) {
			return null;
		}
		const tagValue = options.scopeManager.getValue(part.value);
		if (!tagValue) {
			return {value: this.fileTypeConfig.tagTextXml};
		}
		const imgBuffer = this.options.getImage(tagValue, part.value);
		if (!imgBuffer) {
			return {value: this.fileTypeConfig.tagTextXml};
		}
		const rId = imgManager.addImageRels(this.getNextImageName(), imgBuffer);
		const sizePixel = this.options.getSize(imgBuffer, tagValue, part.value);
		return this.getRenderedPart(part, rId, sizePixel);
	}
	getRenderedPart(part, rId, sizePixel) {
		if (isNaN(rId)) {
			throw new Error("rId is NaN, aborting");
		}
		const size = [DocUtils.convertPixelsToEmus(sizePixel[0]), DocUtils.convertPixelsToEmus(sizePixel[1])];
		const centered = (this.options.centered || part.centered);
		let newText;
		if (this.fileType === "pptx") {
			newText = this.getRenderedPartPptx(part, rId, size, centered);
		}
		else {
			newText = this.getRenderedPartDocx(rId, size, centered);
		}
		return {value: newText};
	}
	getRenderedPartPptx(part, rId, size, centered) {
		const offset = {x: part.offset.x, y: part.offset.y};
		const cellCX = part.ext.cx;
		const cellCY = part.ext.cy;
		const imgW = size[0];
		const imgH = size[1];

		if (centered) {
			offset.x += cellCX / 2 - imgW / 2;
			offset.y += cellCY / 2 - imgH / 2;
		}

		return templates.getPptxImageXml(rId, [imgW, imgH], offset);
	}
	getRenderedPartDocx(rId, size, centered) {
		return centered ? templates.getImageXmlCentered(rId, size) : templates.getImageXml(rId, size);
	}
	getNextImageName() {
		const name = `image_generated_${this.imageNumber}.png`;
		this.imageNumber++;
		return name;
	}
}

module.exports = ImageModule;
