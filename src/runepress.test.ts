import { describe, expect, it, vi } from "vitest";

import { ObjectWithRunes } from "./runepress.js";

const message = "Yay, testing!";

describe(ObjectWithRunes, () => {
	it("logs to the console once when message is provided as a string", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		const obj = new ObjectWithRunes();
		obj.addActionBlock({
			actions: [{ actionType: "output_message", message }],
			actionsElse: [],
			conditions: [
				{
					variable: "rune",
					condition: "equals",
					value: 1,
				},
			],
		});
		obj.pressRune(1);

		expect(logger).toHaveBeenCalledWith(message);
		expect(logger).toHaveBeenCalledTimes(1);
	});

	it("logs to the console once when message is provided as an object", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		const obj = new ObjectWithRunes();
		obj.addActionBlock({
			actions: [{ actionType: "output_message", message }],
			actionsElse: [],
			conditions: [
				{
					variable: "rune",
					condition: "equals",
					value: 1,
				},
			],
		});
		obj.pressRune(1);

		expect(logger).toHaveBeenCalledWith(message);
		expect(logger).toHaveBeenCalledTimes(1);
	});
});
