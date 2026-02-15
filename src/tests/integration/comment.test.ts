import assert from "node:assert";
import type { Server } from "node:http";
import { after, before, describe, test } from "node:test";
import { app } from "../../app/app.ts";

describe("Comment API - /v1/comment", () => {
	let server: Server;
	let baseUrl: string;

	before(async () => {
		server = app.listen(0);
		const address = server.address();
		if (address && typeof address !== "string") {
			baseUrl = `http://localhost:${address.port}/v1/comment`;
		}
	});

	after(() => {
		server.close();
	});

	test("POST / - should create a comment and return 201", async () => {
		const payload = { content: "New integration test comment" };

		const res = await fetch(`${baseUrl}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const body = await res.json();
		assert.strictEqual(res.status, 201);
		assert.strictEqual(body.content, payload.content);
		assert.ok(body.id);
	});

	test("POST / - should return a 400 validation error for invalid data (Zod validation)", async () => {
		const payload = { content: "" };

		const res = await fetch(`${baseUrl}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		assert.strictEqual(res.status, 400);
	});

	test("GET / - should return all comments and 200", async () => {
		const response = await fetch(`${baseUrl}/`);
		const body = await response.json();

		assert.strictEqual(response.status, 200);
		assert.ok(Array.isArray(body));
		assert.ok(body.length > 0);
	});

	test("GET /:id - should return 200 for existing comment", async () => {
		const res = await fetch(`${baseUrl}/1`);
		const body = await res.json();

		assert.strictEqual(res.status, 200);
		assert.strictEqual(body.id, "1");
	});

	test("PATH :/id - should update comment content and return 200", async () => {
		const updatePayload = { content: "Updated integration test comment" };

		const res = await fetch(`${baseUrl}/2`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatePayload),
		});

		const body = await res.json();
		assert.strictEqual(res.status, 200);
		assert.strictEqual(body.content, "Updated integration test comment");
	});
});
