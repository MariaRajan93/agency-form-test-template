    export type FormDefinition = {
        _id?: string;
        _vid?: number;
        title?: string;
        name?: string;
        display?: "form" | "wizard";
        components: Array<any>;
        properties?: Record<string, unknown>;
    };