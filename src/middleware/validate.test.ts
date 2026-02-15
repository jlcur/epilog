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

		const req = { body: { name: "John", query: {}, params: {} } } as any;
		const res = {} as any;
		const next = mock.fn();

		await middleware(req, res, next);

		assert.strictEqual(next.mock.callCount(), 1);
		assert.strictEqual(next.mock.calls[0].arguments.length, 0);
	});

	it("should return 400 and not call next() if validation fails", async () => {
		const middleware = validateRequest(testSchema);

		const req = { body: { name: "Ab" }, query: {}, params: {} } as any; // Too short

		// Mock Response with a chainable status().send()
		const send = mock.fn();
		const res = {
			status: mock.fn(() => ({ send })),
		} as any;
		const next = mock.fn();

		await middleware(req, res, next);

		assert.strictEqual(res.status.mock.callCount(), 1);
		assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
		assert.strictEqual(next.mock.callCount(), 0);

		const errorBody = send.mock.calls[0].arguments[0];
		assert.strictEqual(errorBody.message, "Validation error");
	});

	it("should overwrite req.body with parsed data (coercion check)", async () => {
		const schemaWithCoercion = z.object({
			query: z.object({
				age: z.coerce.number(),
			}),
		});
		const middleware = validateRequest(schemaWithCoercion);

		const req = { query: { age: "25" }, body: {}, params: {} } as any;
		const res = {} as any;
		const next = mock.fn();

		await middleware(req, res, next);

		// Verify the string "25" was transformed into the number 25
		assert.strictEqual(req.query.age, 25);
	});
});
