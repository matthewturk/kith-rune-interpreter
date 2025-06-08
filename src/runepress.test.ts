import { describe, expect, it, vi } from "vitest";
import { dereferenceSync } from "dereference-json-schema";

import { ObjectWithRunes } from "./runepress.js";

import testData from "../test-assets/example-objects.json";
import { IRunePressActionBlock } from "./types.js";

const message = "Yay, testing!";
const messageBad = "Oh no, something went wrong!";

describe(ObjectWithRunes, () => {
	const exampleObjectData = dereferenceSync(testData);
	it("logs to the console", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);
		const obj = new ObjectWithRunes();
		for (const block of exampleObjectData.example_object.blocks) {
			obj.addActionBlock(block as IRunePressActionBlock);
		}
		obj.pressRune(1);
		expect(logger).toHaveBeenCalledWith("Hello, world!");
		expect(logger).toHaveBeenCalledTimes(1);
	});
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

	it("checks that rune activation works", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);
		const obj = new ObjectWithRunes();
		for (const block of exampleObjectData.doorlock_activation.blocks) {
			obj.addActionBlock(block as IRunePressActionBlock);
		}
		obj.pressRune(8);
		expect(obj.variables.activated).toBe(1);
	});

	it("logs variable value on press", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);
		const obj = new ObjectWithRunes();
		for (const block of testData.increments_and_logs.blocks) {
			obj.addActionBlock(block as IRunePressActionBlock);
		}
		obj.pressRune(1);
		expect(logger).toHaveBeenCalledTimes(1);
		expect(logger).toHaveBeenCalledWith("1");
		//logger.mockReset();
		logger.mockClear();
		obj.pressRune(2);
		expect(logger).toHaveBeenCalledTimes(1);
		expect(logger).toHaveBeenCalledWith("2");
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

	it("roll dice whenever rune 5 is pressed", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		const obj = new ObjectWithRunes();
		obj.addActionBlock({
			actions: [
				{
					actionType: "roll_dice",
					diceExpression: "2d6+3",
					variable: "result",
				},
			],
			actionsElse: [],
			conditions: [
				{
					variable: "rune",
					condition: "equals",
					value: 5,
				},
			],
		});
		obj.pressRune(5);
		expect(obj.variables.result).toBeDefined();
		expect(obj.variables.result).toBeGreaterThanOrEqual(5);
		//expect(logger).toHaveBeenCalledWith("Rolling dice with expression: 2d6+3");
		expect(logger).toHaveBeenCalledTimes(0);
	});
});
