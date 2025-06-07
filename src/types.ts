export interface IRunePressCondition {
	variable: string;
	condition: "equals" | "not_equals" | "greater_than" | "less_than";
	value: string | number | boolean;
}

export type ActionType =
	| "set_variable"
	| "increment_variable"
	| "decrement_variable"
	| "output_message"
	| "roll_dice"
	| "reset";

export interface ISetVariableAction {
	actionType: "set_variable";
	variable: string;
	value: string | number | boolean;
}

export interface IIncrementVariableAction {
	actionType: "increment_variable";
	variable: string;
	value: number | string; // Either a number or a variable name
}

export interface IDecrementVariableAction {
	actionType: "decrement_variable";
	variable: string;
	value: number | string; // Either a number or a variable name
}
export interface IOutputMessageAction {
	actionType: "output_message";
	message: string;
}

export interface IRollDiceAction {
	actionType: "roll_dice";
	diceExpression: string; // e.g. "2d6+3"
	variable: string; // Variable to store the result
}

export interface IResetAction {
	actionType: "reset";
}

export type IRunePressAction =
	| ISetVariableAction
	| IIncrementVariableAction
	| IDecrementVariableAction
	| IOutputMessageAction
	| IRollDiceAction
	| IResetAction;

export interface IRunePressActionBlock {
	actions: IRunePressAction[];
	condition?: IRunePressCondition;
}
