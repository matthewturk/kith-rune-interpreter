import {
	IOutputMessageAction,
	IRunePressActionBlock,
	SpecificActionEvaluators,
	ISetVariableAction,
	IIncrementVariableAction,
	IDecrementVariableAction,
	IRollDiceAction,
	IResetAction,
} from "./types.js";

import Handlebars from "handlebars";

export class ObjectWithRunes {
	actions: IRunePressActionBlock[] = [];
	variables: Record<string, number> = {};
	conditionEvaluators: Record<
		string,
		(variable: string, value: number) => boolean
	> = {
		equals: (variable, value) => this.variables[variable] === value,
		not_equals: (variable, value) => this.variables[variable] !== value,
		greater_than: (variable, value) => this.variables[variable] > value,
		less_than: (variable, value) => this.variables[variable] < value,
	};
	actionEvaluators: SpecificActionEvaluators = {
		output_message: (action: IOutputMessageAction) => {
			// Use Handlebars to process the message with the current variables
			const template = Handlebars.compile(action.message);
			const message = template(this.variables);
			console.log(message);
		},
		set_variable: (action: ISetVariableAction) => {
			this.variables[action.variable] = action.value;
		},
		increment_variable: (action: IIncrementVariableAction) => {
			let value: number;
			if (typeof action.value === "string") {
				// If the value is a variable name, retrieve its value
				value = this.variables[action.value] || 0;
			} else {
				// If the value is a number, use it directly
				value = action.value;
			}
			this.variables[action.variable] =
				(this.variables[action.variable] || 0) + value;
		},
		decrement_variable: (action: IDecrementVariableAction) => {
			let value: number;
			if (typeof action.value === "string") {
				// If the value is a variable name, retrieve its value
				value = this.variables[action.value] || 0;
			} else {
				// If the value is a number, use it directly
				value = action.value;
			}
			this.variables[action.variable] =
				(this.variables[action.variable] || 0) - value;
		},
		roll_dice: (action: IRollDiceAction) => {
			// Placeholder for dice rolling logic
			console.warn(`Rolling dice with expression: ${action.diceExpression}`);
			// You would implement the actual dice rolling logic here
		},
		reset: (action: IResetAction) => {
			if (action.resetAll) {
				this.variables = {};
			}
			if (action.resetVariables) {
				for (const variable of action.resetVariables) {
					delete this.variables[variable];
				}
			}
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
		//console.log(`Rune pressed: ${rune}`);
		for (const block of this.actions) {
			let conditionMet = true;
			for (const condition of block.conditions) {
				// Here you would check the condition and execute actions if it passes
				// This is a placeholder for actual condition checking logic
				//console.warn(this.conditionEvaluators);
				//console.log(`Checking condition: ${JSON.stringify(condition)}`);
				if (
					!this.conditionEvaluators[condition.condition](
						condition.variable,
						condition.value,
					)
				) {
					conditionMet = false;
					break;
				}
			}
			const actions = conditionMet ? block.actions : block.actionsElse;
			for (const action of actions) {
				// Here you would execute the action
				// This is a placeholder for actual action execution logic
				this.actionEvaluators[action.actionType](action);
			}
		}
	}
}
