export interface IRunePressCondition {
	condition:
		| "equals"
		| "not_equals"
		| "greater_than"
		| "less_than"
		| "one_of"
		| "not_in";
	variable: string;
	value: number | number[]; // Can be a single number or an array of numbers for "one_of" and "not_in"
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
	value: number;
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
	resetVariables?: string[]; // Optional list of variables to reset
	resetAll?: boolean; // If true, reset all variables
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
	actionsElse: IRunePressAction[]; // if any condition fails, these actions will be executed
	conditions: IRunePressCondition[];
}

export type ActionByType<T extends string> = Extract<
	IRunePressAction,
	{ actionType: T }
>;

export type SpecificActionEvaluators = {
	[K in IRunePressAction["actionType"]]: (action: ActionByType<K>) => void;
};
