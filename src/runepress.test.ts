import { describe, expect, it, vi } from "vitest";

import { ObjectWithRunes } from "./runepress.js";

const message = "Yay, testing!";
const messageBad = "Oh no, something went wrong!";

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

	it("does nothing when wrong rune is pressed", () => {
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
		obj.pressRune(2);

		//expect(logger).toHaveBeenCalledWith(message);
		expect(logger).toHaveBeenCalledTimes(0);
	});

	it("Log to the console once rune 2 has been pressed twice", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		const obj = new ObjectWithRunes();
		obj.addActionBlock({
			actions: [
				{ actionType: "increment_variable", variable: "pressed", value: 1 },
			],
			actionsElse: [],
			conditions: [
				{
					variable: "rune",
					condition: "equals",
					value: 2,
				},
			],
		});
		obj.addActionBlock({
			actions: [
				{ actionType: "output_message", message: messageBad },
				{ actionType: "reset", resetAll: true },
			],
			actionsElse: [],
			conditions: [
				{
					variable: "rune",
					condition: "equals",
					value: 2,
				},
				{
					variable: "pressed",
					condition: "greater_than",
					value: 5,
				},
			],
		});
		obj.addActionBlock({
			actions: [
				{ actionType: "output_message", message },
				{ actionType: "reset", resetAll: true },
			],
			actionsElse: [],
			conditions: [
				{
					variable: "rune",
					condition: "equals",
					value: 3,
				},
				{
					variable: "pressed",
					condition: "greater_than",
					value: 1,
				},
			],
		});
		// This checks that we press rune 2 twice before pressing 3, then it resets and does it again.
		obj.pressRune(2);
		obj.pressRune(2);
		expect(logger).toHaveBeenCalledTimes(0);
		obj.pressRune(3);
		expect(logger).toHaveBeenCalledWith(message);
		expect(logger).toHaveBeenCalledTimes(1);
		obj.pressRune(2);
		obj.pressRune(2);
		expect(logger).toHaveBeenCalledTimes(1);
		obj.pressRune(3);
		expect(logger).toHaveBeenCalledWith(message);
		expect(logger).toHaveBeenCalledTimes(2);
		// It's been reset, so pressing rune 2 twice again should not log anything.
		obj.pressRune(2);
		obj.pressRune(2);
		obj.pressRune(2);
		// Check that it still doesn't log anything.
		expect(logger).toHaveBeenCalledTimes(2);
		obj.pressRune(3);
		expect(logger).toHaveBeenCalledWith(message);
		expect(logger).toHaveBeenCalledTimes(3);

		// Now let's blow it up
		obj.pressRune(2);
		obj.pressRune(2);
		obj.pressRune(2);
		// Check that it still doesn't log anything.
		expect(logger).toHaveBeenCalledTimes(3);
		obj.pressRune(2);
		obj.pressRune(2);
		obj.pressRune(2);
		expect(logger).toHaveBeenCalledWith(messageBad);
		expect(logger).toHaveBeenCalledTimes(4);
	});

	it("increments a variable by 1 when rune 2 is pressed", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		const obj = new ObjectWithRunes();
		obj.addActionBlock({
			actions: [
				{ actionType: "increment_variable", variable: "pressed", value: 1 },
			],
			actionsElse: [],
			conditions: [
				{
					variable: "rune",
					condition: "equals",
					value: 2,
				},
			],
		});
		obj.addActionBlock({
			actions: [
				{ actionType: "output_message", message: "Pressed {{pressed}} times" },
				{ actionType: "reset", resetAll: true },
			],
			actionsElse: [],
			conditions: [
				{
					variable: "rune",
					condition: "equals",
					value: 2,
				},
				{
					variable: "pressed",
					condition: "greater_than",
					value: 5,
				},
			],
		});
		obj.pressRune(2);
		expect(obj.variables.pressed).toBe(1);
		obj.pressRune(2);
		expect(obj.variables.pressed).toBe(2);
		expect(logger).toHaveBeenCalledTimes(0);
		obj.pressRune(2);
		expect(obj.variables.pressed).toBe(3);
		expect(logger).toHaveBeenCalledTimes(0);
		obj.pressRune(2);
		expect(obj.variables.pressed).toBe(4);
		expect(logger).toHaveBeenCalledTimes(0);
		obj.pressRune(2);
		expect(obj.variables.pressed).toBe(5);
		expect(logger).toHaveBeenCalledTimes(0);
		obj.pressRune(2);
		// expect(obj.variables.pressed).toBe(6); // We don't expect this, because it's been reset!
		expect(logger).toHaveBeenCalledWith("Pressed 6 times");
		expect(logger).toHaveBeenCalledTimes(1);
		obj.pressRune(2);
		expect(obj.variables.pressed).toBe(1);
	});
});
