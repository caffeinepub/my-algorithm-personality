import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface OnlineActivityEntry {
    id: bigint;
    externalBlob?: ExternalBlob;
    sourceLabel: string;
    notes: string;
    timestamp: bigint;
    image?: Uint8Array;
}
export interface DailyProgramEntry {
    day: bigint;
    explanation: string;
    task: Habit;
    reflectionPrompt?: string;
}
export interface Pattern {
    patternType: string;
    snippet: string;
    confidenceScore: bigint;
}
export interface Program {
    days: Array<DailyProgramEntry>;
    checkIns: Array<DailyCheckIn>;
}
export interface Habit {
    id: string;
    duration: bigint;
    action: string;
    difficulty: bigint;
    whenToCue: string;
    rationale: string;
    category: string;
}
export interface DailyCheckIn {
    day: bigint;
    moodRating?: bigint;
    reducedBehavior: boolean;
    notes: string;
    taskCompleted: boolean;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addActivityEntry(entry: [bigint, string, string], image: Uint8Array | null, externalBlob: ExternalBlob | null): Promise<bigint>;
    addCheckIn(checkIn: DailyCheckIn): Promise<void>;
    addPattern(pattern: Pattern): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProgram(program: Program): Promise<void>;
    getActivityEntries(): Promise<Array<OnlineActivityEntry>>;
    getActivityEntry(id: bigint): Promise<OnlineActivityEntry | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHabitLibrary(): Promise<Array<Habit>>;
    getPatterns(): Promise<Array<Pattern>>;
    getProgram(): Promise<Program | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedHabitLibrary(newLibrary: Array<Habit>): Promise<void>;
}
