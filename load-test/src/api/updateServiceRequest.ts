import { performGapiOperation } from "./performGapiOperation.ts";
import type { MyQldServiceRequestUpdateInput } from "../../../libs/types/gql.d.ts"


type Props = {
    accessToken: string;
    transactionId: string;
    requestId: string;
    subjectId: GapiSubjectId;
    input: MyQldServiceRequestUpdateInput;
};

type Response = {
    updateMyQLDServiceRequest: string;
};

export enum GapiSubjectId {
    AGENT = "agent",
    CITIZEN = "citizen",
}

export const updateServiceRequest = async ({ accessToken, transactionId, requestId, subjectId, input }: Props) => {
    return await performGapiOperation<Response>({
        accessToken,
        operationName: "UpdateMyQLDServiceRequest",
        query: query,
        variables: { transactionId, requestId, subjectId, input },
    });
};

const query = `mutation UpdateMyQLDServiceRequest(
        $input: MyQLDServiceRequestUpdateInput!, 
        $requestId: ID!, 
        $subjectId: String!, 
        $transactionId: ID!
    ) {
    updateMyQLDServiceRequest(
        input: $input, 
        requestId: $requestId, 
        subjectId: $subjectId, 
        transactionId: $transactionId)
  }
`;
