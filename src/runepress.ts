import {
	IOutputMessageAction,
	IRunePressActionBlock,
	SpecificActionEvaluators,
	ISetVariableAction,
	IIncrementVariableAction,
	IDecrementVariableAction,
	IRollDiceAction,
	IResetAction,
	IRunePressAction,
	ActionResult,
} from "./types.js";

import Handlebars from "handlebars";
import { DiceRoller } from "dice-roller-parser";

export class ObjectWithRunes {
	actions: IRunePressActionBlock[] = [];
	variables: Record<string, number | undefined> = {};
	diceRoller: DiceRoller = new DiceRoller();
	logger: (message: string) => void = (message: string) => {
		return;
	};
	conditionEvaluators: Record<
		string,
		(variable: string, value: string | number) => boolean
	> = {
		equals: (variable, value) => {
			this.logger(
				`Checking if ${variable} equals ${value}: ${this.variables[variable] === value}`,
			);
			if (typeof value === "string") {
				// If the value is a string, it might be a variable name
				value = this.variables[value] ?? value; // Fallback to the variable name if not found
			}

			return this.variables[variable] === value;
		},
		not_equals: (variable, value) => {
			this.logger(`Checking if ${variable} does not equal ${value}`);
			if (typeof value === "string") {
				// If the value is a string, it might be a variable name
				value = this.variables[value] ?? value; // Fallback to the variable name if not found
			}

			return this.variables[variable] !== value;
		},
		greater_than: (variable, value) => {
			this.logger(`Checking if ${variable} is greater than ${value}`);
			if (this.variables[variable] === undefined) {
				return false; // If the variable is undefined, treat it as less than any defined value
			}
			if (typeof value === "string") {
				if (this.variables[value] === undefined) {
					return false; // If the value variable is undefined, treat it as greater than any defined value
				}
				return this.variables[variable] > this.variables[value];
			}
			return this.variables[variable] > value;
		},
		less_than: (variable, value) => {
			this.logger(`Checking if ${variable} is less than ${value}`);
			if (this.variables[variable] === undefined) {
				return false; // If the variable is undefined, treat it as greater than any defined value
			}
			if (typeof value === "string") {
				if (this.variables[value] === undefined) {
					return false; // If the value variable is undefined, treat it as greater than any defined value
				}
				return this.variables[variable] < this.variables[value];
			}
			return this.variables[variable] < value;
		},
		one_of: (variable, value) => {
			this.logger(
				`Checking if ${variable} is one of ${value}: ${this.variables[variable]}`,
			);
			if (this.variables[variable] === undefined) {
				return false; // If the variable is undefined, treat it as not one of any values
			}
			// Check if the variable's value is one of the valid values
			const validValues = Array.isArray(value) ? value : [value];
			return validValues.includes(this.variables[variable]);
		},
		not_in: (variable, value) => {
			this.logger(
				`Checking if ${variable} is not in ${value}: ${this.variables[variable]}`,
			);
			if (this.variables[variable] === undefined) {
				return true; // If the variable is undefined, treat it as not in any values
			}
			const invalidValues = Array.isArray(value) ? value : [value];
			return !invalidValues.includes(this.variables[variable]);
		},
	};
	actionEvaluators: SpecificActionEvaluators = {
		output_message: (action: IOutputMessageAction) => {
			// Use Handlebars to process the message with the current variables
			const template = Handlebars.compile(action.message);
			const message = template(this.variables);
			this.logger(`Outputting message: ${message}`);
			return message as ActionResult;
		},
		set_variable: (action: ISetVariableAction) => {
			this.logger(`Setting variable ${action.variable} to ${action.value}`);
			this.variables[action.variable] = action.value;
			return {
				[action.variable]: this.variables[action.variable] as ActionResult,
			};
		},
		increment_variable: (action: IIncrementVariableAction) => {
			this.logger(
				`Incrementing variable ${action.variable} by ${action.value}`,
			);
			let value: number;
			if (typeof action.value === "string") {
				// If the value is a variable name, retrieve its value
				value = this.variables[action.value] ?? 0;
			} else {
				// If the value is a number, use it directly
				value = action.value;
			}
			this.variables[action.variable] =
				(this.variables[action.variable] ?? 0) + value;
			return {
				[action.variable]: this.variables[action.variable] as ActionResult,
			};
		},
		decrement_variable: (action: IDecrementVariableAction) => {
			this.logger(
				`Decrementing variable ${action.variable} by ${action.value}`,
			);
			let value: number;
			if (typeof action.value === "string") {
				// If the value is a variable name, retrieve its value
				value = this.variables[action.value] ?? 0;
			} else {
				// If the value is a number, use it directly
				value = action.value;
			}
			this.variables[action.variable] =
				(this.variables[action.variable] ?? 0) - value;
			return {
				[action.variable]: this.variables[action.variable] as ActionResult,
			};
		},
		roll_dice: (action: IRollDiceAction) => {
			this.logger(
				`Rolling dice with expression ${action.diceExpression} and storing result in ${action.variable}`,
			);
			this.variables[action.variable] = this.diceRoller.roll(
				action.diceExpression,
			).value;
			return {
				[action.variable]: this.variables[action.variable] as ActionResult,
			};
		},
		reset: (action: IResetAction) => {
			this.logger(`Reseting variables.`);

			if (action.resetAll) {
				this.variables = {};
			} else if (action.resetVariables) {
				for (const variable of action.resetVariables) {
					this.variables[variable] = undefined;
				}
			}
			return undefined;
		},
	};

	/**
	 * Adds a new action block to the object.
	 * @param block The action block to add.
	 */
	addActionBlock(block: IRunePressActionBlock): void {
		this.actions.push(block);
		//console.log(`Action block added: ${JSON.stringify(block)}`);
	}

	pressRune(rune: number): void {
		this.variables.rune = rune;
		for (const block of this.actions) {
			let conditionMet = true;
			for (const condition of block.conditions ?? []) {
				// Here you would check the condition and execute actions if it passes
				// This is a placeholder for actual condition checking logic
				//console.warn(this.conditionEvaluators);
				//console.log(`Checking condition: ${JSON.stringify(condition)}`);
				if (
					!this.conditionEvaluators[condition.condition](
						condition.variable,
						condition.value as string | number,
					)
				) {
					conditionMet = false;
					break;
				}
			}
			const actions = conditionMet ? block.actions : block.actionsElse;
			const results: ActionResult[] = [];
			for (const action of actions ?? []) {
				// Here you would execute the action
				// This is a placeholder for actual action execution logic
				const evaluator = this.actionEvaluators[action.actionType] as (
					a: IRunePressAction,
				) => ActionResult | undefined;
				const result = evaluator(action);
				if (result !== undefined) {
					// If the action returns a result, store it
					results.push(result);
				}
			}
		}
	}
}
