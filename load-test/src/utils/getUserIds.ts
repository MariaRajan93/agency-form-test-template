import { fail } from "k6";
import exec from "k6/execution";
import { config } from "../../config/config.ts";

export const getTestUserIdsDTP = () => {
    return expandUserIdRanges(config.LOAD_TEST_USER_IDS_DTP).split(",");
};

export const getIterationBasedUserIdDTP = () => {
    const testUsers = getTestUserIdsDTP();
    const userIndex = exec.vu.idInTest - 1;
    // we should keep number of VUs less than equal to test users so this if never happens
    // but will leave this one just in case we don't want to blow out the test
    if (userIndex >= testUsers.length) {
        fail(
            `User index bigger than number of test users available. userIndex: ${userIndex}, No. of test users: ${testUsers.length}`
        );
    }

    return testUsers[exec.vu.idInTest - 1];
};

export const getTestUserIdsPortal = () => {
    return expandUserIdRanges(config.LOAD_TEST_USER_IDS_PORTAL).split(",");
};

export const getIterationBasedUserIdPortal = () => {
    const testUsers = getTestUserIdsPortal();
    const userIndex = exec.vu.idInTest - 1;
    // we should keep number of VUs less than equal to test users so this if never happens
    // but will leave this one just in case we don't want to blow out the test
    if (userIndex >= testUsers.length) {
        fail(
            `User index bigger than number of test users available. userIndex: ${userIndex}, No. of test users: ${testUsers.length}`
        );
    }

    return testUsers[exec.vu.idInTest - 1];
};

export const getTestUserIdsAF = () => {
    return expandUserIdRanges(config.LOAD_TEST_USER_IDS_AF).split(",");
};

export const getIterationBasedUserIdAF = () => {
    const testUsers = getTestUserIdsAF();
    const userIndex = exec.vu.idInTest - 1;
    // we should keep number of VUs less than equal to test users so this if never happens
    // but will leave this one just in case we don't want to blow out the test
    if (userIndex >= testUsers.length) {
        fail(
            `User index bigger than number of test users available. userIndex: ${userIndex}, No. of test users: ${testUsers.length}`
        );
    }

    return testUsers[exec.vu.idInTest - 1];
};

export const expandUserIdRanges = (rangeString: string): string => {
    // we will need test with 5k users for DTP breakpoint test
    // use range as string format like [1-5],[10-15] would be a better option
    if (!rangeString || typeof rangeString !== "string") return "";

    const matches = rangeString.match(/\[(\d+)-(\d+)\]/g);
    const numbers: number[] = [];

    if (!matches) return "";

    for (const match of matches) {
        const [startStr, endStr] = match.slice(1, -1).split("-");
        const start = Number(startStr);
        const end = Number(endStr);

        if (isNaN(start) || isNaN(end) || start > end) {
            // skip invalid or reversed ranges
            continue;
        }

        for (let i = start; i <= end; i++) {
            numbers.push(i);
        }
    }

    const result = [...new Set(numbers)].sort((a, b) => a - b);
    return result.join(",");
};
