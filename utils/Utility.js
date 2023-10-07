// This does not export your father!!!

export class Utility {
	static encodeBase64(string) {
		return new Buffer(string).toString("base64");
	}

	static decodeBase64(string) {
		return new Buffer(string, "base64").toString("ascii");
	}
}
