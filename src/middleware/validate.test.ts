import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { z } from "zod";
import { validateRequest } from "./validate.ts";

describe("validateRequest Middleware", () => {
	const testSchema = z.object({
		body: z.object({
			name: z.string().min(3),
		}),
	});

	it("should call next() if validation passes", async () => {
		const middleware = validateRequest(testSchema);

		const req = { body: { name: "John" }, query: {}, params: {} } as any;
		const res = { locals: {} } as any;
		const next = mock.fn();

		await middleware(req, res, next);

		assert.strictEqual(next.mock.callCount(), 1);
		const firstCall = next.mock.calls[0];
		assert.ok(firstCall);
		assert.strictEqual(firstCall.arguments.length, 0);
	});

	it("should return 400 and not call next() if validation fails", async () => {
		const middleware = validateRequest(testSchema);

		const req = { body: { name: "Ab" }, query: {}, params: {} } as any; // Too short

		// Mock Response with a chainable status().send()
		const send = mock.fn();
		const res = {
			locals: {},
			status: mock.fn(() => ({ send })),
		} as any;
		const next = mock.fn();

		await middleware(req, res, next);

		assert.strictEqual(res.status.mock.callCount(), 1);
		const statusCall = res.status.mock.calls[0];
		assert.ok(statusCall);
		assert.strictEqual(statusCall.arguments[0], 400);
		assert.strictEqual(next.mock.callCount(), 0);

		const sendCall = send.mock.calls[0];
		assert.ok(sendCall);
		assert.strictEqual(sendCall.arguments[0]?.message, "Validation error");
	});

	it("should store coerced values in res.locals", async () => {
		const schemaWithCoercion = z.object({
			query: z.object({
				age: z.coerce.number(),
			}),
		});
		const middleware = validateRequest(schemaWithCoercion);

		const req = { query: { age: "25" }, body: {}, params: {} } as any;
		const res = { locals: {} } as any;
		const next = mock.fn();

		await middleware(req, res, next);

		assert.strictEqual(res.locals.query.age, 25);
	});
});
