// import assert from "node:assert";
// import type { Server } from "node:http";
// import { after, before, beforeEach, describe, test } from "node:test";
// import short from "short-uuid";
// import { app } from "../../app/app.ts";
// import { db } from "../../shared/database/database.ts";
// import { migrateDb } from "../utils/migrate-db.ts";
//
// const translator = short.createTranslator();

// describe("Comment API - api/v1/comment", () => {
// 	let server: Server;
// 	let baseUrl: string;
//
// 	before(async () => {
// 		await migrateDb();
// 		server = app.listen(0);
// 		const address = server.address();
// 		if (address && typeof address !== "string") {
// 			baseUrl = `http://localhost:${address.port}/api/v1/comment`;
// 		}
// 	});
//
// 	beforeEach(async () => {
// 		await db.deleteFrom("comments").execute();
// 	});
//
// 	after(async () => {
// 		await db.destroy();
// 		server.close();
// 	});
//
// 	test("POST / - should create a comment and return 201", async () => {
// 		const payload = { content: "New integration test comment" };
//
// 		const res = await fetch(`${baseUrl}`, {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify(payload),
// 		});
//
// 		const body = await res.json();
// 		assert.strictEqual(res.status, 201);
// 		assert.strictEqual(body.content, payload.content);
// 		assert.ok(body.id);
// 	});
//
// 	test("POST / - should return a 400 validation error for invalid data (Zod validation)", async () => {
// 		const payload = { content: "" };
//
// 		const res = await fetch(`${baseUrl}`, {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify(payload),
// 		});
//
// 		assert.strictEqual(res.status, 400);
// 	});
//
// 	test("GET / - should return all comments and 200", async () => {
// 		await db
// 			.insertInto("comments")
// 			.values({ content: "First comment content" })
// 			.execute();
//
// 		const response = await fetch(`${baseUrl}/`);
// 		const body = await response.json();
//
// 		assert.strictEqual(response.status, 200);
// 		assert.ok(Array.isArray(body));
// 		assert.ok(body.length > 0);
// 	});
//
// 	test("GET /:id - should return 200 for existing comment", async () => {
// 		const seededComment = await db
// 			.insertInto("comments")
// 			.values({ content: "Seeded comment" })
// 			.returningAll()
// 			.executeTakeFirstOrThrow();
//
// 		const shortId = translator.fromUUID(seededComment.id);
//
// 		const res = await fetch(`${baseUrl}/${shortId}`);
// 		const body = await res.json();
//
// 		assert.strictEqual(res.status, 200);
// 		assert.strictEqual(body.id, shortId);
// 	});
//
// 	test("PATCH :/id - should update comment content and return 200", async () => {
// 		const seededComment = await db
// 			.insertInto("comments")
// 			.values({ content: "Seeded comment to update" })
// 			.returningAll()
// 			.executeTakeFirstOrThrow();
//
// 		const updatePayload = { content: "Updated integration test comment" };
//
// 		const shortId = translator.fromUUID(seededComment.id);
//
// 		const res = await fetch(`${baseUrl}/${shortId}`, {
// 			method: "PATCH",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify(updatePayload),
// 		});
//
// 		const body = await res.json();
// 		assert.strictEqual(res.status, 200);
// 		assert.strictEqual(body.content, "Updated integration test comment");
// 	});
//
// 	test("DELETE :/id - should delete comment and return 204 no content", async () => {
// 		const seededComment = await db
// 			.insertInto("comments")
// 			.values({ content: "Seeded comment data to delete" })
// 			.returningAll()
// 			.executeTakeFirstOrThrow();
//
// 		const shortId = translator.fromUUID(seededComment.id);
//
// 		const res = await fetch(`${baseUrl}/${shortId}`, {
// 			method: "DELETE",
// 		});
//
// 		assert.strictEqual(res.status, 204);
//
// 		// Comments table should now be empty
// 		const commentsTable = await db.selectFrom("comments").selectAll().execute();
// 		assert.strictEqual(commentsTable.length, 0);
// 	});
// });
