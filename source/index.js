const arrayPartRegex = /(.+)(?:\[(\d*)\])/;

export default function formDataToObject(formdata) {
	let result = {};
	for (let [key, value] of formdata) {
		let part;
		let root = result;
		let parts = key.split(".");

		while ((part = parts.shift())) {
			let [attribute, index] = part.match(arrayPartRegex)?.slice(1) ?? [part];

			if (parts.length) {
				if (index == undefined) {
					if (root[attribute] == undefined) {
						root[attribute] = {};
					}

					root = root[attribute];
				} else {
					if (root[attribute] == undefined) {
						root[attribute] = [];
					}

					let rootIndex = index;
					if (rootIndex === "") {
						let length = root[attribute].length;
						if (length === 0) {
							root = root[attribute][length] = {};
						} else {
							let maybeRoot = root[attribute][length - 1];
							let maybeParts = [...parts];
							if (typeof maybeRoot !== "object") {
								root = root[attribute][length] = {};
							} else {
								while ((part = maybeParts.shift())) {
									let [attribute, index] = part.match(arrayPartRegex)?.slice(1) ?? [part];

									if (index == undefined) {
										maybeRoot = maybeRoot[attribute];
									} else if (index === "") {
										break;
									} else {
										maybeRoot = maybeRoot[attribute][index];
									}

									if (maybeRoot == undefined) {
										break;
									}
								}

								if (maybeParts.length === 0 && maybeRoot != undefined) {
									root = root[attribute][length] = {};
								} else {
									root = root[attribute][length - 1];
								}
							}
						}
					} else {
						let rootValue = root[attribute][rootIndex];
						if (rootValue == undefined) {
							rootValue = root[attribute][rootIndex] = {};
						}

						root = rootValue;
					}
				}
			} else {
				if (index == undefined) {
					root[attribute] = value;
				} else {
					if (root[attribute] == undefined) {
						root[attribute] = [];
					}

					if (index === "") {
						root[attribute].push(value);
					} else {
						root[attribute][index] = value;
					}
				}
			}
		}
	}

	return result;
}
