import * as Uvu from "uvu";
import * as assert from "uvu/assert";

import formDataToObject from "../index.js";

let suite = Uvu.suite("formdata-to-object");

suite("test 1", () => {
	let data = [["a", "x"]];

	let result = formDataToObject(data);

	assert.is(result.a, "x");
});

suite("test 2", () => {
	let data = [
		["a", "x"],
		["b", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a, "x");
	assert.is(result.b, "y");
});

suite("test 3", () => {
	let data = [
		["a.b", "x"],
		["a.c", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.b, "x");
	assert.is(result.a.c, "y");
});

suite("test 4", () => {
	let data = [
		["a.b.c", "x"],
		["a.d.e", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.b.c, "x");
	assert.is(result.a.d.e, "y");
});

suite("test 5", () => {
	let data = [
		["a[]", "x"],
		["a[]", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 2);
	assert.is(result.a[0], "x");
	assert.is(result.a[1], "y");
});

suite("test 6", () => {
	let data = [
		["a[].b", "x"],
		["a[].c", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 1);
	assert.is(result.a[0].b, "x");
	assert.is(result.a[0].c, "y");
});

suite("test 7", () => {
	let data = [
		["a[].b", "x"],
		["a[].b", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 2);
	assert.is(result.a[0].b, "x");
	assert.is(result.a[1].b, "y");
});

suite("test 8", () => {
	let data = [
		["a[].b.c.d", "x"],
		["a[].b.c.d", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 2);
	assert.is(result.a[0].b.c.d, "x");
	assert.is(result.a[1].b.c.d, "y");
});

suite("test 9", () => {
	let data = [
		["a[].b.c.d", "x"],
		["a[].b.c.e", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 1);
	assert.is(result.a[0].b.c.d, "x");
	assert.is(result.a[0].b.c.e, "y");
});

suite("test 10", () => {
	let data = [
		["a[].b.c[].d", "x"],
		["a[].b.c[].d", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 1);
	assert.is(result.a[0].b.c.length, 2);
	assert.is(result.a[0].b.c[0].d, "x");
	assert.is(result.a[0].b.c[1].d, "y");
});

suite("test 11", () => {
	let data = [
		["a[].b.c[].d", "x"],
		["a[].b.c[].e", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 1);
	assert.is(result.a[0].b.c.length, 1);
	assert.is(result.a[0].b.c[0].d, "x");
	assert.is(result.a[0].b.c[0].e, "y");
});

suite("test 12", () => {
	let data = [
		["a", "x"],
		["a.b", "y"],
	];

	try {
		formDataToObject(data);
		assert.unreachable("Should have thrown error creating property 'c' on string 'w'");
	} catch (error) {
		assert.instance(error, Error);
	}
});

suite("test 13", () => {
	let data = [
		["a[]", "x"],
		["a[].b", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 2);
	assert.is(result.a[0], "x");
	assert.is(result.a[1].b, "y");
});

suite("test 14", () => {
	let data = [
		["a[].b.c[0].d", "x"],
		["a[].b.c[0].d", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 2);
	assert.is(result.a[0].b.c[0].d, "x");
	assert.is(result.a[1].b.c[0].d, "y");
});

suite("test 14", () => {
	let data = [
		["a[0].b", "x"],
		["a[1].b", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 2);
	assert.is(result.a[0].b, "x");
	assert.is(result.a[1].b, "y");
});

suite("test 15", () => {
	let data = [
		["a[0].b", "x"],
		["a[2].b", "y"],
	];

	let result = formDataToObject(data);

	assert.is(result.a.length, 3);
	assert.is(result.a[0].b, "x");
	assert.is(result.a[1], undefined);
	assert.is(result.a[2].b, "y");
});

suite.run();
