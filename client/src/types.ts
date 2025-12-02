export interface User {
    id: string;
    userId: string; // Added to match server type
    name: string;
    isHost: boolean;
    score: number;
    avatar?: string;
}

export interface Constraint {
    id: string;
    publicDescriptions: string[];
    hiddenDescription: string;
}

export interface Report {
    id: string;
    ownerId: string;
    selectedKeywords: string[];
    constraint: Constraint;
    title: string;
    containmentProcedures: string;
    descriptionEarly: string;
    descriptionLate: string;
    conclusion: string;
    authors: {
        procedures: string;
        descEarly: string;
        descLate: string;
    };
}

export type GamePhase =
    | 'LOBBY'
    | 'SUGGESTION'
    | 'CHOICE'
    | 'SCRIPTING_1'
    | 'SCRIPTING_2'
    | 'SCRIPTING_3'
    | 'SCRIPTING_4'
    | 'PRESENTATION'
    | 'VOTING'
    | 'RESULT';

export interface GameState {
    phase: GamePhase;
    users: User[];
    keywordsPool: string[];
    reports: Report[];
    timer: {
        remaining: number;
        isActive: boolean;
        isBlinking: boolean;
    };
    readyStates: { [userId: string]: boolean };
    votes: {
        bestReportVotes: { [targetReportId: string]: number };
        constraintChecks: { [reportId: string]: { [voterId: string]: boolean } };
    };
    currentPresentationIndex: number;
}
