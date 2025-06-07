export interface IRunePressCondition {
	variable: string;
	condition: "equals" | "not_equals" | "greater_than" | "less_than";
	value: string | number | boolean;
}

export type ActionType =
	| "set_variable"
	| "increment_variable"
	| "decrement_variable"
	| "output_message";
export interface ISetVariableAction {
	actionType: "set_variable";
	variable: string;
	value: string | number | boolean;
}

export type IRunePressAction = ISetVariableAction;
